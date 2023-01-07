import { HTMLElement } from 'node-html-parser';
type OnHtmlResultCallback = (html: HTMLElement) => string;
type OnValueChangeCallback = (oldValue: MaybeString, newValue: MaybeString) => void;
export type MaybeString = string | null | undefined;
export interface TaskResult {
    taskName: string;
    taskResult: MaybeString;
}
export interface TaskConfig {
    interval: number;
}
export interface Task {
    id: string;
    title: string;
    resource: string;
    onHtmlResult: OnHtmlResultCallback;
    config: TaskConfig;
    onValueChange: OnValueChangeCallback;
}
export declare const newTask: (title: string, resource: string, onHtmlResult: OnHtmlResultCallback, config?: TaskConfig, onValueChange?: OnValueChangeCallback) => {
    id: string;
    title: string;
    resource: string;
    onHtmlResult: OnHtmlResultCallback;
    config: TaskConfig;
    onValueChange: OnValueChangeCallback;
};
export declare class Engine {
    private taskResultsByTaskId;
    private tasks;
    constructor(tasks: Task[]);
    start(): void;
    performTask(task: Task): Promise<void>;
    updateTaskResult(task: Task, taskResult: MaybeString): void;
    runTask(task: Task): Promise<MaybeString>;
    getCurrentTaskResults(): TaskResult[];
}
export {};
