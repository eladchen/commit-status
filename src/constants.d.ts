// https://docs.github.com/en/rest/reference/repos#create-a-commit-status
export enum CommitStatusState {
  ERROR = "error",
  FAILURE = "failure",
  PENDING = "pending",
  SUCCESS = "success",
}

// https://docs.github.com/en/actions/reference/context-and-expression-syntax-for-github-actions#steps-context
export enum StepConclusion {
  SUCCESS = "success",
  FAILURE = "failure",
  CANCELLED = "cancelled",
  SKIPPED = "skipped",
}

// https://github.community/t/documentation-for-workflow-jobs-is-ambiguous/129158
export enum JobConclusion {
  null,
  "failure",
  "success",
  "timed_out",
  "cancelled",
  "neutral",
}
