import * as core from "@actions/core";
import { action as mainAction } from "./action-main";
import { action as postAction } from "./action-post";

/*
 * https://github.com/actions/toolkit/tree/master/packages/core
 * https://github.com/actions/toolkit/tree/master/packages/github
 * https://docs.github.com/en/actions/creating-actions/creating-a-javascript-action
 * https://github.com/actions/javascript-action
 * https://docs.github.com/en/actions/configuring-and-managing-workflows/configuring-a-workflow#referencing-actions-in-your-workflow
 **/

const postActionStateIdentifier = "isPost";
const isPostActionEnvVariable = `STATE_${postActionStateIdentifier}`;

const entryPoint = async (): Promise<void> => {
  try {
    const isPostAction = process.env[isPostActionEnvVariable] !== undefined;

    if (!isPostAction) {
      core.saveState(postActionStateIdentifier, "true");

      await mainAction();
    } //
    else {
      await postAction();
    }
  } catch (e) {
    core.setFailed(e);
  }
};

if (require.main === module) {
  entryPoint();
}

export { isPostActionEnvVariable, entryPoint };
