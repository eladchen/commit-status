"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.action = void 0;
const github = __importStar(require("@actions/github"));
const octokit = __importStar(require("./octokit"));
const action_inputs_1 = require("./action-inputs");
const commit_status_parameters_1 = require("./commit-status-parameters");
const getCurrentJobSteps = (params) => __awaiter(void 0, void 0, void 0, function* () {
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
        const workflowRunJobs = yield octokit.listJobsForWorkflowRun(listJobsForWorkflowRunParams);
        const currentJob = workflowRunJobs.find(findCurrentJob);
        const inProgressSteps = currentJob.steps.filter(isInProgressStep);
        if (inProgressSteps.length === 1) {
            return currentJob.steps;
        }
        if (Date.now() - started >= timeout) {
            throw new Error(`timeout reached`);
        }
        yield new Promise(sleep);
    }
});
function action() {
    return __awaiter(this, void 0, void 0, function* () {
        if (action_inputs_1.updateCommitStatus()) {
            const failureConclusions = new Set(["failure", "cancelled"]);
            const commitStatusParams = yield commit_status_parameters_1.commitStatusParameters(github.context);
            const currentJobSteps = yield getCurrentJobSteps({
                owner: commitStatusParams.owner,
                repo: commitStatusParams.repo,
                runId: github.context.runId,
                jobName: github.context.job,
            });
            let commitStatusState = "success";
            for (const step of currentJobSteps) {
                if (failureConclusions.has(step.conclusion)) {
                    commitStatusState = "failure";
                    break;
                }
            }
            yield octokit.createCommitStatus(Object.assign(Object.assign({}, commitStatusParams), { state: commitStatusState }));
        }
    });
}
exports.action = action;
