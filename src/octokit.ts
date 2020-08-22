import * as core from "@actions/core";
import * as github from "@actions/github";
import { GitHub } from "@actions/github/lib/utils";

const octokit = (): InstanceType<typeof GitHub> => {
  const token = core.getInput("token", { required: true });

  return github.getOctokit(token);
};

export { octokit };
