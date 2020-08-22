import * as core from "@actions/core";
import * as github from "@actions/github";

/*
 * https://github.com/actions/toolkit/tree/master/packages/core
 * https://github.com/actions/toolkit/tree/master/packages/github
 * https://docs.github.com/en/actions/creating-actions/creating-a-javascript-action
 * https://github.com/actions/javascript-action
 * https://docs.github.com/en/actions/configuring-and-managing-workflows/configuring-a-workflow#referencing-actions-in-your-workflow
 **/

async function action(): Promise<void> {
  try {
    // `who-to-greet` input defined in action metadata file
    const nameToGreet = core.getInput("who-to-greet");
    console.log(`Hello ${nameToGreet}!`);
    const time = new Date().toTimeString();
    core.setOutput("time", time);
    // Get the JSON webhook payload for the event that triggered the workflow
    const payload = JSON.stringify(github.context.payload, undefined, 2);
    console.log(`The event payload: ${payload}`);
  } catch (e) {
    core.setFailed(e.message);
  }
}

export { action };
