import * as core from "@actions/core";
import { action as mainAction } from "./actions/main";
import { action as postAction } from "./actions/post";

const postActionStateIdentifier = "ben-isPost";

const isPostAction = core.getState(postActionStateIdentifier) !== undefined;

console.log(typeof core.getState(postActionStateIdentifier));
console.log(isPostAction);

if (!isPostAction) {
  core.saveState(postActionStateIdentifier, "true");

  mainAction();
} //
else {
  postAction();
}
