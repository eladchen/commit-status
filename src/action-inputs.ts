import * as core from "@actions/core";
import * as github from "@actions/github";

const booleanInput = (name: string): boolean => {
  const bool = core.getInput(name) !== "false";

  core.debug(`input ${name} is ${bool}`);

  return bool;
};

const shaInput = (): string => {
  const actionInput = core.getInput("sha");

  if (!actionInput) {
    // eslint-disable-next-line camelcase
    const botInput = eventInput()?.pull_request?.head.sha;

    if (!botInput) {
      throw new Error("'sha' input must be a non empty string");
    }

    return botInput;
  }

  return actionInput;
};

const repoInput = (): string => {
  const actionInput = core.getInput("repo");

  if (!actionInput) {
    const botInput = eventInput()?.repository?.name;

    if (!botInput) {
      throw new Error("'repo' input must be a non empty string");
    }

    return botInput;
  }

  return actionInput;
};

const ownerInput = (): string => {
  const actionInput = core.getInput("owner");

  if (!actionInput) {
    const botInput = eventInput()?.repository?.owner?.login;

    if (!botInput) {
      throw new Error("'owner' input must be a non empty string");
    }

    return botInput;
  }

  return actionInput;
};

const eventInput = (): Record<string, any> | null => {
  const event = github.context.payload?.inputs?.event;

  return event ? JSON.parse(event) : null;
};

const tokenInput = (): string => core.getInput("token", { required: true });

const acceptInput = (): string => core.getInput("accept") ?? "application/vnd.github.v3+json";

const contextInput = (): string => core.getInput("context");

const targetUrlInput = (): string => core.getInput("target_url");

const descriptionInput = (): string => core.getInput("description");

const updateCommitStatus = (): boolean => {
  return booleanInput("update-commit-status");
};

export {
  shaInput,
  repoInput,
  ownerInput,
  eventInput,
  tokenInput,
  acceptInput,
  contextInput,
  targetUrlInput,
  descriptionInput,
  updateCommitStatus,
};
