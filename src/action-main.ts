import to from "await-to-js";
import * as core from "@actions/core";
import * as github from "@actions/github";

import { getOctokit } from "./get-octokit";
import { updateCommitStatus } from "./action-inputs";
import { getCommitStatusParameters } from "./get-commit-status-parameters";

/*
 * https://github.com/actions/toolkit/tree/master/packages/core
 * https://github.com/actions/toolkit/tree/master/packages/github
 * https://docs.github.com/en/actions/creating-actions/creating-a-javascript-action
 * https://github.com/actions/javascript-action
 * https://docs.github.com/en/actions/configuring-and-managing-workflows/configuring-a-workflow#referencing-actions-in-your-workflow
 **/

const setPendingCommitStatus = async ({ owner, repo, ref }): Promise<void> => {
  if (updateCommitStatus()) {
    const octokit = getOctokit();
    const combinedStatusForRef = octokit.repos.getCombinedStatusForRef;
    const [error, response] = await to(octokit.paginate(combinedStatusForRef, { owner, repo, ref }));

    if (error) {
      core.setFailed(error);
    }

    // if state is not "pending" -> update it to pending (whats the context? job name?)
    console.log(response);
  }
};

async function action(): Promise<void> {
  const { owner, repo, sha } = await getCommitStatusParameters(github.context);

  core.setOutput("commitSHA", sha);
  core.setOutput("repositoryName", repo);
  core.setOutput("repositoryOwner", owner);

  await setPendingCommitStatus({ owner, repo, ref: sha });
}

export { action };
