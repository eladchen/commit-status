import * as github from "@actions/github";
import { GitHub } from "@actions/github/lib/utils";
import { RestEndpointMethodTypes } from "@octokit/plugin-rest-endpoint-methods";

import { tokenInput } from "./action-inputs";

type GetWorkflowRunParameters = RestEndpointMethodTypes["actions"]["getWorkflowRun"]["parameters"];
type GetWorkflowRunResponse = RestEndpointMethodTypes["actions"]["getWorkflowRun"]["response"];

type GertWorkflowRunJobsParams = RestEndpointMethodTypes["actions"]["listJobsForWorkflowRun"]["parameters"];
type GetWorkflowRunJobsResponse = RestEndpointMethodTypes["actions"]["listJobsForWorkflowRun"]["response"];

type CreateCommitStatusParameters = RestEndpointMethodTypes["repos"]["createCommitStatus"]["parameters"];
type CreateCommitStatusResponse = RestEndpointMethodTypes["repos"]["createCommitStatus"]["response"];

const getOctokit = (): InstanceType<typeof GitHub> => {
  const token = tokenInput();

  return github.getOctokit(token);
};

const getWorkflowRun = async (parameters: GetWorkflowRunParameters): Promise<GetWorkflowRunResponse> => {
  const octokit = getOctokit();

  return await octokit.actions.getWorkflowRun(parameters);
};

const createCommitStatus = async (params: CreateCommitStatusParameters): Promise<CreateCommitStatusResponse> => {
  const octokit = getOctokit();

  return await octokit.repos.createCommitStatus(params);
};

const listJobsForWorkflowRun = async (params: GertWorkflowRunJobsParams): Promise<GetWorkflowRunJobsResponse> => {
  const octokit = getOctokit();
  const workflowRunJobs = await octokit.paginate(octokit.actions.listJobsForWorkflowRun, params);

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  return workflowRunJobs;
};

export { getWorkflowRun, createCommitStatus, listJobsForWorkflowRun };
