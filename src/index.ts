import fetch from 'node-fetch';
import { HTMLElement, parse } from 'node-html-parser';
import { uuid } from 'uuidv4';

const DEFAULT_INTERVAL = 10_000;

type OnHtmlResultCallback = (html: HTMLElement) => string
type OnValueChangeCallback = (oldValue: MaybeString, newValue: MaybeString) => void
export type MaybeString = string | null | undefined;
export interface TaskResult {
    taskName: string,
    taskResult: MaybeString
} 

export interface TaskConfig {
    interval: number  
}

export interface Task {
    id: string,
    title: string,
    resource: string,
    onHtmlResult: OnHtmlResultCallback,
    config: TaskConfig,
    onValueChange: OnValueChangeCallback
}

export const newTask = (
    title: string, 
    resource: string, 
    onHtmlResult: OnHtmlResultCallback,
    config?: TaskConfig,
    onValueChange?: OnValueChangeCallback
) => {
    const id = uuid();
    if (!config) {
        config = {
            interval: DEFAULT_INTERVAL
        }
    }

    if (!onValueChange) {
        onValueChange = (oldValue, newValue) => {
            console.log(`Task[${id}] has been set from [${oldValue}] to [${newValue}]`)
        }
    }

    return {
        id, title, resource, onHtmlResult, config, onValueChange
    }
}

export class Engine {
    private taskResultsByTaskId: Map<string, string>;
    private tasks: Task[];

    constructor(tasks: Task[]) {
        this.tasks = tasks;
        this.taskResultsByTaskId = new Map<string, string>()
    }

    start() {
        this.tasks.forEach(task => {
            setInterval(this.performTask.bind(this, task), task.config.interval)
        })
    }

    async performTask(task: Task) {
        const taskResult = await this.runTask(task);
        this.updateTaskResult(task, taskResult)
    }

    updateTaskResult(task: Task, taskResult: MaybeString) {
        if (taskResult) {
            if (taskResult != this.taskResultsByTaskId.get(task.id)) {
                const oldValue = this.taskResultsByTaskId.get(task.id);
                this.taskResultsByTaskId.set(task.id, taskResult);
                task.onValueChange(oldValue, taskResult);
            }
        }
    }

    async runTask(task: Task): Promise<MaybeString> {
        try {
            console.log(`[LOG] Running the task: ${task.id}`)
            const resource = await fetch(task.resource)
            const text = await resource.text()
            const root = parse(text);
            const result = task.onHtmlResult(root);
            return result
        } catch (error) {
            console.error(error);
            return null;
        }
    }

    getCurrentTaskResults(): TaskResult[] {
        return this.tasks
            .map(task => ({
                taskName: task.title, 
                taskResult: this.taskResultsByTaskId.get(task.id)
            }))
    }
}