import * as core from "@actions/core";
import { Context } from "@actions/github/lib/context";

import * as octokit from "../octokit";
import * as main from "../action-main";
import * as post from "../action-post";
import { withContext, withInputs } from "./test-utils";
import { entryPoint, isPostActionEnvVariable } from "../index";
import * as commitStatusParams from "../commit-status-parameters";
import * as updateCommitStatus from "../action-update-commit-status";

describe("main action", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  test("output is set", async () => {
    const expected = {
      sha: "sha",
      repo: "repo",
      owner: "owner",
      accept: "accept",
      context: "context",
      target_url: "target_url",
      description: "description",
    };
    const setOutput = jest.spyOn(core, "setOutput");
    const commitStatusParameters = jest.spyOn(commitStatusParams, "commitStatusParameters");
    const updateCommitStatusAction = jest.spyOn(updateCommitStatus, "action");

    commitStatusParameters.mockResolvedValue(expected);
    updateCommitStatusAction.mockResolvedValue(undefined);

    await main.action();

    expect(setOutput).toHaveBeenNthCalledWith(1, "commitSHA", expected.sha);
    expect(setOutput).toHaveBeenNthCalledWith(2, "repositoryName", expected.repo);
    expect(setOutput).toHaveBeenNthCalledWith(3, "repositoryOwner", expected.owner);
  });

  test("updates commit status", async () => {
    const expected = {
      sha: "sha",
      repo: "repo",
      owner: "owner",
      accept: "accept",
      context: "context",
      target_url: "target_url",
      description: "description",
    };
    const commitStatusParameters = jest.spyOn(commitStatusParams, "commitStatusParameters");
    const updateCommitStatusAction = jest.spyOn(updateCommitStatus, "action");

    commitStatusParameters.mockResolvedValue(expected);
    updateCommitStatusAction.mockResolvedValueOnce(undefined);

    await main.action();

    expect(updateCommitStatusAction).toHaveBeenCalledWith(expected);
    expect(updateCommitStatusAction).toHaveBeenCalledTimes(1);
  });
});

describe("post action", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  test("updates commit status", async () => {
    const expected = {
      sha: "sha",
      repo: "repo",
      owner: "owner",
      accept: "accept",
      context: "context",
      target_url: "target_url",
      description: "description",
    };
    const commitStatusParameters = jest.spyOn(commitStatusParams, "commitStatusParameters");
    const updateCommitStatusAction = jest.spyOn(updateCommitStatus, "action");

    commitStatusParameters.mockResolvedValue(expected);
    updateCommitStatusAction.mockResolvedValueOnce(undefined);

    await post.action();

    expect(updateCommitStatusAction).toHaveBeenCalledWith(expected);
    expect(updateCommitStatusAction).toHaveBeenCalledTimes(1);
  });
});

describe("action entry-point", () => {
  test("calls main action", async () => {
    const mainAction = jest.spyOn(main, "action");

    await entryPoint();

    expect(mainAction).toHaveBeenCalledTimes(1);
  });

  test("calls post action", async () => {
    const mainAction = jest.spyOn(post, "action");

    process.env[isPostActionEnvVariable] = "1";

    await entryPoint();

    delete process.env[isPostActionEnvVariable];

    expect(mainAction).toHaveBeenCalledTimes(1);
  });
});

describe("update commit status action", () => {
  let createCommitStatus: jest.SpyInstance;
  let listJobsForWorkflowRun: jest.SpyInstance;

  beforeAll(() => {
    createCommitStatus = jest.spyOn(octokit, "createCommitStatus");
    listJobsForWorkflowRun = jest.spyOn(octokit, "listJobsForWorkflowRun");
  });

  afterAll(() => {
    createCommitStatus.mockRestore();

    listJobsForWorkflowRun.mockRestore();
  });

  afterEach(() => {
    createCommitStatus.mockReset();
    listJobsForWorkflowRun.mockReset();
  });

  test("commit status is updated", async () => {
    const context = new Context();
    const jobConclusion = null;
    const inputs = { "update-commit-status": "true", token: "123" };
    const commitStatusParameters = {
      sha: "sha",
      repo: "repo",
      owner: "owner",
      accept: "accept",
      context: "context",
      target_url: "target_url",
      description: "description",
    };
    const createCommitStatus = jest.spyOn(octokit, "createCommitStatus");
    const listJobsForWorkflowRun = jest.spyOn(octokit, "listJobsForWorkflowRun");
    const expectedCommitStatusState = updateCommitStatus.jobConclusionToCommitStatusState(jobConclusion);

    context.runId = 1;

    createCommitStatus.mockReturnValueOnce({
      // @ts-expect-error silence, I kill you 💀💣!
      data: {},
    });

    // @ts-expect-error silence, I kill you 💀💣!
    listJobsForWorkflowRun.mockReturnValueOnce([{ name: "job name", conclusion: jobConclusion }]);

    await withInputs(inputs, async () => {
      return withContext(context, async () => {
        await updateCommitStatus.action(commitStatusParameters);

        expect(listJobsForWorkflowRun).toHaveBeenCalledWith({
          owner: commitStatusParameters.owner,
          repo: commitStatusParameters.repo,
          run_id: context.runId,
        });

        expect(createCommitStatus).toHaveBeenCalledWith({
          ...commitStatusParameters,
          state: expectedCommitStatusState,
        });
      });
    });
  });

  test("commit status is not updated", async () => {
    const inputs = { "update-commit-status": "false" };
    const commitStatusParameters = {
      sha: "sha",
      repo: "repo",
      owner: "owner",
      accept: "accept",
      context: "context",
      target_url: "target_url",
      description: "description",
    };

    await withInputs(inputs, async () => {
      await updateCommitStatus.action(commitStatusParameters);

      expect(createCommitStatus).not.toHaveBeenCalled();
      expect(listJobsForWorkflowRun).not.toHaveBeenCalled();
    });
  });

  test("unknown job conclusion throws", () => {
    const jobConclusion = "bad";
    const actual = () => {
      updateCommitStatus.jobConclusionToCommitStatusState(jobConclusion);
    };

    expect(actual).toThrowError(`unknown job conclusion '${jobConclusion}'`);
  });

  test("job conclusion is mapped to a commit status", () => {
    const jobConclusionCommitStatus = [
      [null, "pending"],
      ["failure", "failure"],
      ["success", "success"],
      ["timed_out", "error"],
      ["cancelled", "failure"],
      ["neutral", "success"],
    ];

    for (const [jobConclusion, expected] of jobConclusionCommitStatus) {
      const commitStatusState = updateCommitStatus.jobConclusionToCommitStatusState(jobConclusion);

      expect(commitStatusState).toStrictEqual(expected);
    }
  });
});
