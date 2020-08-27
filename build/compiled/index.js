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
exports.entryPoint = exports.isPostActionEnvVariable = void 0;
const core = __importStar(require("@actions/core"));
const action_main_1 = require("./action-main");
const action_post_1 = require("./action-post");
const postActionStateIdentifier = "isPost";
const isPostActionEnvVariable = `STATE_${postActionStateIdentifier}`;
exports.isPostActionEnvVariable = isPostActionEnvVariable;
const entryPoint = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const isPostAction = process.env[isPostActionEnvVariable] !== undefined;
        if (!isPostAction) {
            core.saveState(postActionStateIdentifier, "true");
            yield action_main_1.action();
        }
        else {
            yield action_post_1.action();
        }
    }
    catch (e) {
        core.setFailed(e);
    }
});
exports.entryPoint = entryPoint;
if (require.main === module) {
    entryPoint();
}
