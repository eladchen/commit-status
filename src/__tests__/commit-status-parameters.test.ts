import { Context } from "@actions/github/lib/context";

import * as octokit from "../octokit";
import { withInputs } from "./test-utils";
import { CommitStatusParameters, commitStatusParameters } from "../commit-status-parameters";

describe(commitStatusParameters, () => {
  test("action provided inputs", async () => {
    const expected: CommitStatusParameters = {
      sha: "sha",
      repo: "repo",
      owner: "owner",
      accept: "accept",
      context: "context",
      target_url: "target_url",
      description: "description",
    };

    await withInputs(expected, async () => {
      const commitStatusParams = await commitStatusParameters(new Context());

      expect(commitStatusParams).toEqual(expect.objectContaining(expected));
    });
  });

  test("target_url property is read from REST API", async () => {
    const expected = "some url";
    const inputs = {
      sha: "sha",
      repo: "repo",
      owner: "owner",
    };
    const getWorkflowRun = jest.spyOn(octokit, "getWorkflowRun");

    getWorkflowRun.mockReturnValueOnce({
      // @ts-expect-error silence, I kill you 💀💣!
      data: {
        html_url: expected,
      },
    });

    await withInputs(inputs, async () => {
      const commitStatusParams = await commitStatusParameters(new Context());

      getWorkflowRun.mockRestore();

      expect(commitStatusParams.target_url).toStrictEqual(expected);
    });
  });

  test("context & description properties are read from context argument", async () => {
    const context = new Context();
    const inputs = {
      sha: "sha",
      repo: "repo",
      owner: "owner",
      target_url: "target_url",
    };

    context.job = "[Job Name]";
    context.workflow = "[Workflow Name]";
    context.eventName = "workflow_dispatch";

    await withInputs(inputs, async () => {
      const actual = await commitStatusParameters(context);

      expect(actual.context).toStrictEqual(context.workflow);
      expect(actual.description).toStrictEqual(`${context.workflow} / ${context.job} (${context.eventName})`);
    });
  });
});
