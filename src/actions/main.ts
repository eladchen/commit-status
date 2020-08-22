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

  if (eventInput !== null) {
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
  const targetUrl = core.getInput("target_url");
  const description = core.getInput("description");
  const context = core.getInput("context");

  return {
    accept,
    owner,
    repo,
    sha,
    target_url: targetUrl,
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

      core.info(`createCommitStatusParameters.target_url ${createCommitStatusParameters.target_url}`);

      if (!createCommitStatusParameters.owner) {
        createCommitStatusParameters.owner = botContext.owner;
      }

      if (!createCommitStatusParameters.repo) {
        createCommitStatusParameters.repo = botContext.repo;
      }

      if (!createCommitStatusParameters.sha) {
        createCommitStatusParameters.sha = botContext.sha;
      }

      if (!createCommitStatusParameters.target_url) {
        const token = core.getInput("token", { required: true });
        const octokit = github.getOctokit(token);
        const workflowRun = await octokit.actions.getWorkflowRun({
          owner: botContext.owner,
          repo: botContext.repo,
          run_id: github.context.runId,
        });

        createCommitStatusParameters.target_url = workflowRun.data.html_url;
      }
    }

    setParameters(createCommitStatusParameters);
  } catch (e) {
    core.setFailed(e.message);
  }
}

export { action };
