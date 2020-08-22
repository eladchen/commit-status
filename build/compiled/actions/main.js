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
const core = __importStar(require("@actions/core"));
const github = __importStar(require("@actions/github"));
const create_commit_status_parameters_1 = require("../create-commit-status-parameters");
const getBotContext = () => {
    var _a, _b;
    const eventInput = JSON.parse(((_b = (_a = github.context.payload) === null || _a === void 0 ? void 0 : _a.inputs) === null || _b === void 0 ? void 0 : _b.event) || null);
    if (eventInput !== null) {
        return {
            owner: eventInput.repository.owner.login,
            repo: eventInput.repository.name,
            sha: eventInput.pull_request.head.sha,
        };
    }
    return null;
};
const getCreateCommitStatusParameters = () => {
    const accept = core.getInput("accept");
    const owner = core.getInput("owner");
    const repo = core.getInput("repo");
    const sha = core.getInput("sha");
    const targetUrl = core.getInput("target_url");
    const description = core.getInput("description");
    const context = core.getInput("context");
    return {
        accept,
        owner,
        repo,
        sha,
        target_url: targetUrl,
        description,
        context,
    };
};
function action() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const botContext = getBotContext();
            const createCommitStatusParameters = getCreateCommitStatusParameters();
            if (botContext !== null) {
                core.setOutput("repositoryOwner", botContext.owner);
                core.setOutput("repositoryName", botContext.repo);
                core.setOutput("repositorySha", botContext.sha);
                core.info(`createCommitStatusParameters.target_url ${createCommitStatusParameters.target_url}`);
                if (!createCommitStatusParameters.owner) {
                    createCommitStatusParameters.owner = botContext.owner;
                }
                if (!createCommitStatusParameters.repo) {
                    createCommitStatusParameters.repo = botContext.repo;
                }
                if (!createCommitStatusParameters.sha) {
                    createCommitStatusParameters.sha = botContext.sha;
                }
                if (!createCommitStatusParameters.target_url) {
                    const token = core.getInput("token", { required: true });
                    const octokit = github.getOctokit(token);
                    const workflowRun = yield octokit.actions.getWorkflowRun({
                        owner: botContext.owner,
                        repo: botContext.repo,
                        run_id: github.context.runId,
                    });
                    createCommitStatusParameters.target_url = workflowRun.data.html_url;
                }
            }
            create_commit_status_parameters_1.setParameters(createCommitStatusParameters);
        }
        catch (e) {
            core.setFailed(e.message);
        }
    });
}
exports.action = action;
