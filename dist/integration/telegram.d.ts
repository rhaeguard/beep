import { MaybeString, TaskResult } from "..";
export declare class TelegramProcessor {
    private bot;
    private chatId;
    constructor(token: string, targetUsername: string);
    registerUser(ctx: any, targetUsername: string): Promise<void>;
    start(): Promise<void>;
    onCurrentTasksResultsCommand(taskResults: () => TaskResult[]): void;
    onValueChange(oldValue: MaybeString, newValue: MaybeString): void;
    stop(): void;
}
