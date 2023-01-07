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
exports.Engine = exports.newTask = void 0;
const node_fetch_1 = __importDefault(require("node-fetch"));
const node_html_parser_1 = require("node-html-parser");
const uuidv4_1 = require("uuidv4");
const DEFAULT_INTERVAL = 10000;
const newTask = (title, resource, onHtmlResult, config, onValueChange) => {
    const id = (0, uuidv4_1.uuid)();
    if (!config) {
        config = {
            interval: DEFAULT_INTERVAL
        };
    }
    if (!onValueChange) {
        onValueChange = (oldValue, newValue) => {
            console.log(`Task[${id}] has been set from [${oldValue}] to [${newValue}]`);
        };
    }
    return {
        id, title, resource, onHtmlResult, config, onValueChange
    };
};
exports.newTask = newTask;
class Engine {
    constructor(tasks) {
        this.tasks = tasks;
        this.taskResultsByTaskId = new Map();
    }
    start() {
        this.tasks.forEach(task => {
            setInterval(this.performTask.bind(this, task), task.config.interval);
        });
    }
    performTask(task) {
        return __awaiter(this, void 0, void 0, function* () {
            const taskResult = yield this.runTask(task);
            this.updateTaskResult(task, taskResult);
        });
    }
    updateTaskResult(task, taskResult) {
        if (taskResult) {
            if (taskResult != this.taskResultsByTaskId.get(task.id)) {
                const oldValue = this.taskResultsByTaskId.get(task.id);
                this.taskResultsByTaskId.set(task.id, taskResult);
                task.onValueChange(oldValue, taskResult);
            }
        }
    }
    runTask(task) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log(`[LOG] Running the task: ${task.id}`);
                const resource = yield (0, node_fetch_1.default)(task.resource);
                const text = yield resource.text();
                const root = (0, node_html_parser_1.parse)(text);
                const result = task.onHtmlResult(root);
                return result;
            }
            catch (error) {
                console.error(error);
                return null;
            }
        });
    }
    getCurrentTaskResults() {
        return this.tasks
            .map(task => ({
            taskName: task.title,
            taskResult: this.taskResultsByTaskId.get(task.id)
        }));
    }
}
exports.Engine = Engine;
