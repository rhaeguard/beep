import { Telegraf } from "telegraf";
import { MaybeString, TaskResult } from "..";

export class TelegramProcessor {
    private bot: Telegraf;
    private chatId: MaybeString;

    constructor(token: string, targetUsername: string) {
        const bot = new Telegraf(token)
        process.once('SIGINT', () => bot.stop('SIGINT'));
        process.once('SIGTERM', () => bot.stop('SIGTERM'));

        this.bot = bot;
        this.bot.command('register', async ctx => await this.registerUser(ctx, targetUsername))
    }

    async registerUser(ctx: any, targetUsername: string) {
        const chat: any = await ctx.getChat()
        if (chat.username && chat.username === targetUsername) {
            this.chatId = chat.id;
            console.log(`Successfully registered the target user`);
            ctx.reply("Registration successful!");
        }
    }

    async start() {
        await this.bot.launch();
    }

    onCurrentTasksResultsCommand(taskResults: () => TaskResult[]) {
        this.bot.command('results', async ctx => {
            const message = taskResults()
                .map(result => `${result.taskName}: ${result.taskResult}`)
                .join("\n");
            
            ctx.reply(message);
        })
    }

    onValueChange(oldValue: MaybeString, newValue: MaybeString): void {
        if (this.chatId) {
            const sanitizedOld = (oldValue ?? "").trim()
            const sanitizedNewValue = (newValue ?? "").trim()
            this.bot.telegram.sendMessage(
                this.chatId,
                `Value changed from [${sanitizedOld}] to [${sanitizedNewValue}]`
            )
        }
    }

    stop() {
        this.bot.stop("SIGTERM");
    }

}