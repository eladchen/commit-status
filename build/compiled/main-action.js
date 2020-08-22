"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.mainAction = void 0;
const core_1 = __importDefault(require("@actions/core"));
const github_1 = __importDefault(require("@actions/github"));
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const nameToGreet = core_1.default.getInput("who-to-greet");
            console.log(`Hello ${nameToGreet}!`);
            const time = new Date().toTimeString();
            core_1.default.setOutput("time", time);
            const payload = JSON.stringify(github_1.default.context.payload, undefined, 2);
            console.log(`The event payload: ${payload}`);
        }
        catch (e) {
            core_1.default.setFailed(e.message);
        }
    });
}
exports.mainAction = run;
if (require.main === module) {
    run();
}
