import * as core from "@actions/core";
import * as github from "@actions/github";

import * as octokit from "./octokit";
import * as actionInputs from "./action-inputs";
import { CommitStatusParameters } from "./commit-status-parameters";

const enum CommitStatusState {
  ERROR = "error",
  FAILURE = "failure",
  PENDING = "pending",
  SUCCESS = "success",
}

/*
 * a job has two properties `conclusion` and `status`
 * which value each property can have is a mystery:
 * https://github.community/t/documentation-for-workflow-jobs-is-ambiguous/129158
 *
 * `conclusion` property possible values are:
 *
 * - null         equivalent commit status is "pending"
 * - "failure"    equivalent commit status is "failure"
 * - "success"    equivalent commit status is "success"
 * - "timed_out"  equivalent commit status is "error"
 * - "cancelled"  equivalent commit status is "failure"
 * - "neutral"    equivalent commit status is "success"
 *
 * `status` property possible values are:
 *
 * - "in_progress" equivalent commit status is "pending"
 * - "completed"   equivalent commit status is "success"
 * - ??
 */
const jobConclusionToCommitStatusState = (conclusion: string | null): CommitStatusState => {
  switch (conclusion) {
    case null:
      return CommitStatusState.PENDING;
    case "timed_out":
      return CommitStatusState.ERROR;
    case "success":
    case "neutral":
      return CommitStatusState.SUCCESS;
    case "failure":
    case "cancelled":
      return CommitStatusState.FAILURE;
    default:
      throw new Error(`unknown job conclusion '${conclusion}'`);
  }
};

const action = async (commitStatusParameters: CommitStatusParameters): Promise<void> => {
  if (actionInputs.updateCommitStatus()) {
    const workflowRunJobs = await octokit.listJobsForWorkflowRun({
      owner: commitStatusParameters.owner,
      repo: commitStatusParameters.repo,
      run_id: github.context.runId,
    });

    core.info(`Updating commit status for sha '${commitStatusParameters.sha}'`);

    // @ts-expect-error workflowRunJobs this is an array
    for (const job of workflowRunJobs) {
      const commitStatusState = jobConclusionToCommitStatusState(job.conclusion);

      core.info(`Job '${job.name}' commit state is ${commitStatusState}`);

      await octokit.createCommitStatus({
        ...commitStatusParameters,
        state: commitStatusState,
      });
    }
  }
};

export { jobConclusionToCommitStatusState, action };
