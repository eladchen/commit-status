import * as github from "@actions/github";

import { getOctokit } from "./get-octokit";
import { updateCommitStatus } from "./action-inputs";
import { getCommitStatusParameters } from "./get-commit-status-parameters";

async function action(): Promise<void> {
  if (updateCommitStatus()) {
    const { owner, repo } = await getCommitStatusParameters(github.context);
    // list jobs, get job conclusions, get
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const workflowRun = await getOctokit().actions.getWorkflowRun({
      owner,
      repo,
      run_id: github.context.runId,
    });

    // console.log(`github: ${JSON.stringify(github, null, 2)}`);
    //
    // console.log(`parameters ${JSON.stringify(getParameters())}`);
    //
    // Object.keys(process.env).forEach((key) => {
    //   console.log(`${key} = ${process.env[key]}`);
    // });
  }
}

export { action };
