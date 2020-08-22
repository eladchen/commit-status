import * as core from "@actions/core";
import { action as mainAction } from "./actions/main";
import { action as postAction } from "./actions/post";

// GITHUB_RUN_ID = 219737679
// GITHUB_RUN_NUMBER = 81
// GITHUB_WORKFLOW = Pull Request

const postActionStateIdentifier = "ben-isPost";

const isPostAction = process.env[`STATE_${postActionStateIdentifier}`] !== undefined;

if (!isPostAction) {
  core.saveState(postActionStateIdentifier, "true");

  mainAction();
} //
else {
  postAction();
}
