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
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateCommitStatus = exports.descriptionInput = exports.targetUrlInput = exports.contextInput = exports.acceptInput = exports.tokenInput = exports.eventInput = exports.ownerInput = exports.repoInput = exports.shaInput = void 0;
const core = __importStar(require("@actions/core"));
const github = __importStar(require("@actions/github"));
const booleanInput = (name) => {
    const bool = core.getInput(name) !== "false";
    core.debug(`input ${name} is ${bool}`);
    return bool;
};
const shaInput = () => {
    var _a, _b;
    const actionInput = core.getInput("sha");
    if (!actionInput) {
        const botInput = (_b = (_a = eventInput()) === null || _a === void 0 ? void 0 : _a.pull_request) === null || _b === void 0 ? void 0 : _b.head.sha;
        if (!botInput) {
            throw new Error("'sha' input must be a non empty string");
        }
        return botInput;
    }
    return actionInput;
};
exports.shaInput = shaInput;
const repoInput = () => {
    var _a, _b;
    const actionInput = core.getInput("repo");
    if (!actionInput) {
        const botInput = (_b = (_a = eventInput()) === null || _a === void 0 ? void 0 : _a.repository) === null || _b === void 0 ? void 0 : _b.name;
        if (!botInput) {
            throw new Error("'repo' input must be a non empty string");
        }
        return botInput;
    }
    return actionInput;
};
exports.repoInput = repoInput;
const ownerInput = () => {
    var _a, _b, _c;
    const actionInput = core.getInput("owner");
    if (!actionInput) {
        const botInput = (_c = (_b = (_a = eventInput()) === null || _a === void 0 ? void 0 : _a.repository) === null || _b === void 0 ? void 0 : _b.owner) === null || _c === void 0 ? void 0 : _c.login;
        if (!botInput) {
            throw new Error("'owner' input must be a non empty string");
        }
        return botInput;
    }
    return actionInput;
};
exports.ownerInput = ownerInput;
const eventInput = () => {
    var _a, _b;
    const event = (_b = (_a = github.context.payload) === null || _a === void 0 ? void 0 : _a.inputs) === null || _b === void 0 ? void 0 : _b.event;
    return event ? JSON.parse(event) : null;
};
exports.eventInput = eventInput;
const tokenInput = () => core.getInput("token", { required: true });
exports.tokenInput = tokenInput;
const acceptInput = () => { var _a; return (_a = core.getInput("accept")) !== null && _a !== void 0 ? _a : "application/vnd.github.v3+json"; };
exports.acceptInput = acceptInput;
const contextInput = () => core.getInput("context");
exports.contextInput = contextInput;
const targetUrlInput = () => core.getInput("target_url");
exports.targetUrlInput = targetUrlInput;
const descriptionInput = () => core.getInput("description");
exports.descriptionInput = descriptionInput;
const updateCommitStatus = () => {
    return booleanInput("update-commit-status");
};
exports.updateCommitStatus = updateCommitStatus;
