import { getOctokit } from "./get-octokit";
import { RestEndpointMethodTypes } from "@octokit/plugin-rest-endpoint-methods";

type GetWorkflowRunParameters = RestEndpointMethodTypes["actions"]["getWorkflowRun"]["parameters"];
type GetWorkflowRunResponse = RestEndpointMethodTypes["actions"]["getWorkflowRun"]["response"];

const getWorkflowRun = async (parameters: GetWorkflowRunParameters): Promise<GetWorkflowRunResponse> => {
  return await getOctokit().actions.getWorkflowRun(parameters);
};

export { getWorkflowRun };
