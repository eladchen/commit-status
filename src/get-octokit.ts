import * as github from "@actions/github";
import { GitHub } from "@actions/github/lib/utils";

import { tokenInput } from "./action-inputs";

const getOctokit = (): InstanceType<typeof GitHub> => {
  const token = tokenInput();

  return github.getOctokit(token);
};

export { getOctokit };
