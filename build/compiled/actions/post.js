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
const octokit_1 = require("../octokit");
const create_commit_status_parameters_1 = require("../create-commit-status-parameters");
function action() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const updateCommitStatus = Boolean(core.getInput("update-commit-status") || "true");
            if (updateCommitStatus) {
                const parameters = create_commit_status_parameters_1.getParameters();
                if (parameters === null) {
                    core.error(`No create commit status parameters found.`);
                    return;
                }
                const workflowRun = yield octokit_1.octokit().actions.getWorkflowRun({
                    owner: parameters.owner,
                    repo: parameters.repo,
                    run_id: github.context.runId,
                });
                console.log(JSON.stringify(workflowRun, null, 2));
            }
        }
        catch (e) {
            core.setFailed(e.message);
        }
    });
}
exports.action = action;
