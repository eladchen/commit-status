import * as core from "@actions/core";
import * as github from "@actions/github";
import { setParameters } from "../create-commit-status-parameters";

/*
 * https://github.com/actions/toolkit/tree/master/packages/core
 * https://github.com/actions/toolkit/tree/master/packages/github
 * https://docs.github.com/en/actions/creating-actions/creating-a-javascript-action
 * https://github.com/actions/javascript-action
 * https://docs.github.com/en/actions/configuring-and-managing-workflows/configuring-a-workflow#referencing-actions-in-your-workflow
 **/

type BotContext = {
  owner: string;
  repo: string;
  sha: string;
};

// type CreateCommitStatusParameters = Endpoints["POST /repos/:owner/:repo/statuses/:sha"]["parameters"];

const getBotContext = (): BotContext | null => {
  const eventInput = JSON.parse(github.context.payload?.inputs?.event || null);

  console.log(`eventInput: ${JSON.stringify(eventInput, null, 2)}`);

  if (eventInput !== null) {
    console.log(`eventInput.repository: ${JSON.stringify(eventInput.repository, null, 2)}`);
    console.log(`eventInput.pull_request: ${JSON.stringify(eventInput.pull_request, null, 2)}`);

    return {
      owner: eventInput.repository.owner.login,
      repo: eventInput.repository.name,
      sha: eventInput.pull_request.head.sha,
    };
  }

  return null;
};

const getCreateCommitStatusParameters = (): Record<string, any> => {
  const accept = core.getInput("accept");
  const owner = core.getInput("owner");
  const repo = core.getInput("repo");
  const sha = core.getInput("sha");
  // const target_url = core.getInput("target_url") || "extract the value from the github object";
  const description = core.getInput("description");
  const context = core.getInput("context");

  return {
    accept,
    owner,
    repo,
    sha,
    description,
    context,
  };
};

async function action(): Promise<void> {
  try {
    const botContext = getBotContext();
    const createCommitStatusParameters = getCreateCommitStatusParameters();

    if (botContext !== null) {
      core.setOutput("repositoryOwner", botContext.owner);
      core.setOutput("repositoryName", botContext.repo);
      core.setOutput("repositorySha", botContext.sha);

      if (createCommitStatusParameters.owner === undefined) {
        createCommitStatusParameters.owner = botContext.owner;
      }

      if (createCommitStatusParameters.repo === undefined) {
        createCommitStatusParameters.repo = botContext.repo;
      }

      if (createCommitStatusParameters.sha === undefined) {
        createCommitStatusParameters.sha = botContext.sha;
      }
    }

    setParameters(createCommitStatusParameters);

    console.log(`The event payload: ${JSON.stringify(github, undefined, 2)}`);
  } catch (e) {
    core.setFailed(e.message);
  }
}

export { action };
