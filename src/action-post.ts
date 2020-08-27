import * as github from "@actions/github";

import { commitStatusParameters } from "./commit-status-parameters";
import { action as updateCommitStatusAction } from "./action-update-commit-status";

async function action(): Promise<void> {
  const commitStatusParams = await commitStatusParameters(github.context);

  await updateCommitStatusAction(commitStatusParams);
}

export { action };
