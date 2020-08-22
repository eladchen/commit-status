import * as core from "@actions/core";
import * as github from "@actions/github";
import { getParameters } from "../create-commit-status-parameters";

async function action(): Promise<void> {
  try {
    Object.keys(process.env).forEach((key) => {
      console.log(`${key} = ${process.env[key]}`);
    });

    console.log(`github: ${JSON.stringify(github)}`);

    console.log(`parameters ${JSON.stringify(getParameters())}`);
  } catch (e) {
    core.setFailed(e.message);
  }
}

export { action };
