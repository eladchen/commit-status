import { Context } from "@actions/github/lib/context";

import { getWorkflowRun } from "./octokit";
import * as actionInputs from "./action-inputs";

type CommitStatusParameters = {
  sha: string;
  repo: string;
  owner: string;
  accept: string;
  context: string;
  target_url: string; // eslint-disable-line camelcase
  description: string;
};

const commitStatusParameters = async (context: Context): Promise<CommitStatusParameters> => {
  const parameters = {
    sha: actionInputs.shaInput(),
    repo: actionInputs.repoInput(),
    owner: actionInputs.ownerInput(),
    accept: actionInputs.acceptInput(),
    context: actionInputs.contextInput(),
    target_url: actionInputs.targetUrlInput(),
    description: actionInputs.descriptionInput(),
  };

  if (!parameters.context) {
    parameters.context = context.workflow;
  }

  if (!parameters.target_url) {
    const workflowRun = await getWorkflowRun({
      owner: parameters.owner,
      repo: parameters.repo,
      run_id: context.runId,
    });

    parameters.target_url = workflowRun.data.html_url;
  }

  if (!parameters.description) {
    parameters.description = `${context.workflow} / ${context.job} (${context.eventName})`;
  }

  return parameters;
};

export type { CommitStatusParameters };

export { commitStatusParameters };
