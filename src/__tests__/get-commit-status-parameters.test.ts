/* eslint-disable import/first */
// eslint-disable-next-line @typescript-eslint/no-var-requires
import requireMocked from "./jest-require-mocked";
const getWorkflowRun = requireMocked("../get-workflow-run", "getWorkflowRun");

import { Context } from "@actions/github/lib/context";

import { withInputs } from "./test-utils";
import { GetCommitStatusParameters, getCommitStatusParameters } from "../get-commit-status-parameters";

describe(getCommitStatusParameters, () => {
  test("action provided inputs", async () => {
    const expected: GetCommitStatusParameters = {
      sha: "sha",
      repo: "repo",
      owner: "owner",
      accept: "accept",
      context: "context",
      target_url: "target_url",
      description: "description",
    };

    await withInputs(expected, async () => {
      const commitStatusParams = await getCommitStatusParameters(new Context());

      expect(commitStatusParams).toEqual(expect.objectContaining(expected));
    });
  });

  test("target_url property is read from workflow run", async () => {
    const context = new Context();
    const inputs = {
      sha: "sha",
      repo: "repo",
      owner: "owner",
    };

    await withInputs(inputs, async () => {
      const expected = "some url";
      const workflowRun = {
        data: {
          html_url: expected,
        },
      };

      getWorkflowRun.mockReturnValueOnce(workflowRun);

      const commitStatusParameters = await getCommitStatusParameters(context);

      expect(commitStatusParameters.target_url).toStrictEqual(expected);
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

    await withInputs(inputs, async () => {
      context.job = "[Job Name]";
      context.workflow = "[Workflow Name]";

      const commitStatusParameters = await getCommitStatusParameters(context);

      expect(commitStatusParameters.context).toStrictEqual(context.workflow);
      expect(commitStatusParameters.description).toStrictEqual(`${context.workflow} / ${context.job}`);
    });
  });
});
