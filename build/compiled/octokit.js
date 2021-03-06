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
exports.listJobsForWorkflowRun = exports.createCommitStatus = exports.getWorkflowRun = void 0;
const core = __importStar(require("@actions/core"));
const github = __importStar(require("@actions/github"));
const action_inputs_1 = require("./action-inputs");
const getOctokit = () => {
    const token = action_inputs_1.tokenInput();
    return github.getOctokit(token);
};
const getWorkflowRun = (parameters) => __awaiter(void 0, void 0, void 0, function* () {
    const octokit = getOctokit();
    return yield octokit.actions.getWorkflowRun(parameters);
});
exports.getWorkflowRun = getWorkflowRun;
const createCommitStatus = (params) => __awaiter(void 0, void 0, void 0, function* () {
    const octokit = getOctokit();
    core.info(`Updating commit status for sha '${params.sha}' to ${params.state}`);
    return yield octokit.repos.createCommitStatus(params);
});
exports.createCommitStatus = createCommitStatus;
const listJobsForWorkflowRun = (params) => __awaiter(void 0, void 0, void 0, function* () {
    const octokit = getOctokit();
    return yield octokit.paginate(octokit.actions.listJobsForWorkflowRun, params);
});
exports.listJobsForWorkflowRun = listJobsForWorkflowRun;
