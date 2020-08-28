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
  const isInProgressStep = ({ status }) => status === "in_progress";
  const listJobsForWorkflowRunParams = {
    owner: params.owner,
    repo: params.repo,
    run_id: params.runId,
  };

  while (true) {
    const workflowRunJobs = await octokit.listJobsForWorkflowRun(listJobsForWorkflowRunParams);
    const currentJob = workflowRunJobs.find(findCurrentJob) as typeof workflowRunJobs[0];
    const inProgressSteps = currentJob.steps.filter(isInProgressStep);

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
}

export { action };
