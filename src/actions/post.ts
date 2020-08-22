import * as core from "@actions/core";
import * as github from "@actions/github";

import { octokit } from "../octokit";
import { getParameters } from "../create-commit-status-parameters";

async function action(): Promise<void> {
  try {
    const updateCommitStatus = Boolean(core.getInput("update-commit-status") || "true");

    if (updateCommitStatus) {
      const parameters = getParameters();

      // console.log(`github: ${JSON.stringify(github, null, 2)}`);
      //
      // console.log(`parameters ${JSON.stringify(getParameters())}`);
      //
      // Object.keys(process.env).forEach((key) => {
      //   console.log(`${key} = ${process.env[key]}`);
      // });

      if (parameters === null) {
        core.error(`No create commit status parameters found.`);

        return;
      }

      const workflowRun = await octokit().actions.getWorkflowRun({
        owner: parameters.owner,
        repo: parameters.repo,
        run_id: github.context.runId,
      });

      console.log(JSON.stringify(workflowRun, null, 2));
    }
  } catch (e) {
    core.setFailed(e.message);
  }
}

export { action };
