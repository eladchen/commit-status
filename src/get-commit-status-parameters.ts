import { Context } from "@actions/github/lib/context";

import * as actionInputs from "./action-inputs";
import { getWorkflowRun } from "./get-workflow-run";

type GetCommitStatusParameters = {
  sha: string;
  repo: string;
  owner: string;
  accept: string;
  context: string;
  target_url: string; // eslint-disable-line camelcase
  description: string;
};

const getCommitStatusParameters = async (context: Context): Promise<GetCommitStatusParameters> => {
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
    parameters.description = `${context.workflow} / ${context.job}`;
  }

  return parameters;
};

export type { GetCommitStatusParameters };

export { getCommitStatusParameters };
