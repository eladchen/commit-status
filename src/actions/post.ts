import * as core from "@actions/core";
import * as github from "@actions/github";
import { getParameters } from "../create-commit-status-parameters";

async function action(): Promise<void> {
  try {
    const parameters = getParameters();

    console.log(`github: ${JSON.stringify(github, null, 2)}`);

    console.log(`parameters ${JSON.stringify(getParameters())}`);

    Object.keys(process.env).forEach((key) => {
      console.log(`${key} = ${process.env[key]}`);
    });

    if (parameters === null) {
      core.error(`No create commit status parameters found.`);
    }
  } catch (e) {
    core.setFailed(e.message);
  }
}

export { action };
