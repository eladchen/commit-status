import * as core from "@actions/core";

// import { Endpoints } from "@octokit/types";
// import * as github from "@actions/github";
//
// type Literal = Record<string, any>;
//
// type CreateCommitStatusParameters = Endpoints["POST /repos/:owner/:repo/statuses/:sha"]["parameters"];
//
// const payloadEventInput = (): Literal | null => {
//   return github.context.payload?.inputs?.event || null;
// };
//
// const botBuildCommand = (eventInput: Literal): CreateCommitStatusParameters | null => {
//   if (eventInput !== null) {
//     return {
//       owner: eventInput.repository.owner.login,
//       repo: eventInput.repository.name,
//       sha: eventInput.pull_request.head.sha,
//       state: "error",
//     };
//   }
//
//   return null;
// };
//
// const botPullRequest = (inputs: Literal): CreateCommitStatusParameters => {
//   return {};
// };
//
// const actionInputs = (): CreateCommitStatusParameters => {
//   return {};
// };
//
// const createCommitStatusParameters = () => {
//   // merge(actionInputs(), botPullRequest(), botBuildCommand())
// };
//
// export { eventInput, botBuildCommand, botPullRequest, actionInputs };

const parametersStateIdentifier = "parameters";

const setParameters = (parameters: Record<string, any>) => {
  core.saveState(parametersStateIdentifier, JSON.stringify(parameters));
};

const getParameters = (): Record<string, any> | null => {
  const parameters = core.getState(parametersStateIdentifier);

  return parameters ? JSON.parse(parameters) : null;
};

export { setParameters, getParameters };
