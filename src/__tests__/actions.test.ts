import nock from "nock";
import * as core from "@actions/core";
import { Context } from "@actions/github/lib/context";

import * as octokit from "../octokit";
import * as main from "../action-main";
import * as post from "../action-post";
import { withContext, withInputs } from "./test-utils";
import { entryPoint, isPostActionEnvVariable } from "../index";
import * as commitStatusParams from "../commit-status-parameters";

const GITHUB_API_URL = "https://api.github.com";

const commitStatusUrl = ({ owner, repo, sha }) => {
  return `/repos/${owner}/${repo}/statuses/${sha}`;
};

const interceptCreateCommitStatus = (params, cb) => {
  const interceptor = nock(GITHUB_API_URL);

  interceptor.post(commitStatusUrl(params)).reply(200, cb);
};

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
    const createCommitStatus = jest.spyOn(octokit, "createCommitStatus");
    const commitStatusParameters = jest.spyOn(commitStatusParams, "commitStatusParameters");

    // @ts-expect-error silence, I kill you 💀 💣!
    createCommitStatus.mockResolvedValue(null);
    commitStatusParameters.mockResolvedValue(expected);

    await main.action();

    expect(setOutput).toHaveBeenNthCalledWith(1, "commitSHA", expected.sha);
    expect(setOutput).toHaveBeenNthCalledWith(2, "repositoryName", expected.repo);
    expect(setOutput).toHaveBeenNthCalledWith(3, "repositoryOwner", expected.owner);
  });

  test("updates commit status", async () => {
    const inputs = {
      sha: "sha",
      repo: "repo",
      owner: "owner",
      accept: "accept",
      context: "context",
      target_url: "target_url",
      description: "description",

      token: "123",
      "update-commit-status": "true",
    };

    await withInputs(inputs, () => {
      return new Promise((resolve, reject) => {
        const intercept = nock(GITHUB_API_URL);

        intercept.post(`/repos/${inputs.owner}/${inputs.repo}/statuses/${inputs.sha}`).reply(200, (_path, body) => {
          const expected = {
            state: "pending",
            accept: inputs.accept,
            context: inputs.context,
            target_url: inputs.target_url,
            description: inputs.description,
          };

          expect(body).toEqual(expect.objectContaining(expected));

          resolve();
        });

        main.action();
      });
    });
  });

  test("does not update commit status", async () => {
    const inputs = {
      sha: "sha",
      repo: "repo",
      owner: "owner",
      target_url: "target_url",
      token: "123",
      "update-commit-status": "false",
    };
    const createCommitStatus = jest.spyOn(octokit, "createCommitStatus");

    await withInputs(inputs, async () => {
      await main.action();

      expect(createCommitStatus).not.toBeCalled();
    });
  });
});

describe("post action", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  test("updates commit status", async () => {
    const runId = 1;
    const jobName = "my job";
    const context = new Context();
    const inputs = {
      token: "123",
      "update-commit-status": "true",

      sha: "sha",
      repo: "repo",
      owner: "owner",
      accept: "accept",
      context: "context",
      target_url: "target_url",
      description: "description",
    };
    const intercept = nock(GITHUB_API_URL);
    const listJobsForWorkflowRunUrl = `/repos/${inputs.owner}/${inputs.repo}/actions/runs/${runId}/jobs`;

    context.runId = runId;
    context.job = jobName;

    intercept.get(listJobsForWorkflowRunUrl).reply(200, () => {
      return [
        {
          name: jobName,
          steps: [{ status: "in_progress" }, { conclusion: "failure" }],
        },
      ];
    });

    await withInputs(inputs, () => {
      return new Promise((resolve) => {
        interceptCreateCommitStatus(inputs, (_path, body) => {
          const expected = {
            state: "failure",
            accept: inputs.accept,
            context: inputs.context,
            target_url: inputs.target_url,
            description: inputs.description,
          };

          expect(body).toEqual(expect.objectContaining(expected));

          resolve();
        });

        withContext(context, () => {
          post.action();
        });
      });
    });
  });

  test("does not update commit status", async () => {
    const inputs = {
      sha: "sha",
      repo: "repo",
      owner: "owner",
      target_url: "target_url",
      token: "123",
      "update-commit-status": "false",
    };
    const createCommitStatus = jest.spyOn(octokit, "createCommitStatus");

    await withInputs(inputs, async () => {
      await post.action();

      expect(createCommitStatus).not.toBeCalled();
    });
  });
});

describe("action entry-point", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

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

  test("calls core.setFailed", async () => {
    const expectedError = new Error();
    const mainAction = jest.spyOn(main, "action");
    const postAction = jest.spyOn(post, "action");
    const setFailed = jest.spyOn(core, "setFailed");

    mainAction.mockRejectedValueOnce(expectedError);
    postAction.mockRejectedValueOnce(expectedError);

    await entryPoint();

    process.env[isPostActionEnvVariable] = "1";

    await entryPoint();

    delete process.env[isPostActionEnvVariable];

    expect(setFailed, "main action").toHaveBeenNthCalledWith(1, expectedError);
    expect(setFailed, "post action").toHaveBeenNthCalledWith(1, expectedError);
  });
});
