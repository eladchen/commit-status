import * as core from "@actions/core";
import * as github from "@actions/github";

import * as octokit from "./octokit";
import { CommitStatusState } from "./constants";
import { updateCommitStatus } from "./action-inputs";
import { commitStatusParameters } from "./commit-status-parameters";

async function action(): Promise<void> {
  const commitStatusParams = await commitStatusParameters(github.context);

  if (updateCommitStatus()) {
    await octokit.createCommitStatus({
      ...commitStatusParams,
      state: CommitStatusState.PENDING,
    });
  }

  core.setOutput("commitSHA", commitStatusParams.sha);
  core.setOutput("repositoryName", commitStatusParams.repo);
  core.setOutput("repositoryOwner", commitStatusParams.owner);
}

export { action };
