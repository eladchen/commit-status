import * as github from "@actions/github";

import * as octokit from "./octokit";
import { updateCommitStatus } from "./action-inputs";
import { CommitStatusState, StepConclusion } from "./constants";
import { commitStatusParameters } from "./commit-status-parameters";

const getCurrentJobSteps = async (params) => {
  const timeout = 1000 * 15;
  const started = Date.now();
  const sleep = (resolve) => setTimeout(resolve, 2000);
  const findCurrentJob = ({ name }) => name === params.jobName;
  const inProgressStep = ({ status }) => status === "in_progress";
  const listJobsForWorkflowRunParams = {
    owner: params.owner,
    repo: params.repo,
    run_id: params.runId,
  };

  while (true) {
    const workflowRunJobs = await octokit.listJobsForWorkflowRun(listJobsForWorkflowRunParams);
    const currentJob = workflowRunJobs.find(findCurrentJob) as typeof workflowRunJobs[0];
    const inProgressSteps = currentJob.steps.filter(inProgressStep);

    if (inProgressSteps.length === 1) {
      return currentJob.steps;
    }

    if (Date.now() - started >= timeout) {
      throw new Error(`timeout reached`);
    }

    await new Promise(sleep);
  }
};

async function action(): Promise<void> {
  if (updateCommitStatus()) {
    const failureConclusions = new Set([StepConclusion.FAILURE, StepConclusion.CANCELLED]);
    const commitStatusParams = await commitStatusParameters(github.context);
    const currentJobSteps = await getCurrentJobSteps({
      owner: commitStatusParams.owner,
      repo: commitStatusParams.repo,
      runId: github.context.runId,
      jobName: github.context.job,
    });

    let commitStatusState = CommitStatusState.SUCCESS;

    for (const step of currentJobSteps) {
      if (failureConclusions.has(step.conclusion as StepConclusion)) {
        commitStatusState = CommitStatusState.FAILURE;

        break;
      }
    }

    await octokit.createCommitStatus({
      ...commitStatusParams,
      state: commitStatusState,
    });
  }

  // step possible conclusion values are:
  // success, failure, cancelled = failure, or skipped = success
  // if cancelled || failure = failure, else success
  // https://pipelines.actions.githubusercontent.com/t1J7t5OR0GbSQsmet60leKqQ50xzWvyH3qpRlPT21JMNwIft8W/_apis/pipelines/1/runs/102/signedlogcontent/3?urlExpires=2020-08-27T21%3A13%3A16.4786392Z&urlSigningMethod=HMACV1&urlSignature=7%2BdUIVFWESqUKhRYUbzua15PDq59YxOUKFtg5BVYGFM%3D
  // https://github.com/eladchen/testing/runs/1016148768?check_suite_focus=true
  // only update the commit status of the job the action is used in (github.context.job)
  // get all jobs ->
}

export { action };
