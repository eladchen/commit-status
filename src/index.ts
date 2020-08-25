import * as core from "@actions/core";
import { action as mainAction } from "./action-main";
import { action as postAction } from "./action-post";

const postActionStateIdentifier = "isPost";

const isPostAction = process.env[`STATE_${postActionStateIdentifier}`] !== undefined;

(async () => {
  try {
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
})();
