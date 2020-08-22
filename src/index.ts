import * as core from "@actions/core";
import { action as mainAction } from "./actions/main";
import { action as postAction } from "./actions/post";

const postActionStateIdentifier = "isPost";

const isPostAction = process.env[`STATE_${postActionStateIdentifier}`] !== undefined;

if (!isPostAction) {
  core.saveState(postActionStateIdentifier, "true");

  mainAction();
} //
else {
  postAction();
}
