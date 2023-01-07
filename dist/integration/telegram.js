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
Object.defineProperty(exports, "__esModule", { value: true });
exports.TelegramProcessor = void 0;
const telegraf_1 = require("telegraf");
class TelegramProcessor {
    constructor(token, targetUsername) {
        const bot = new telegraf_1.Telegraf(token);
        process.once('SIGINT', () => bot.stop('SIGINT'));
        process.once('SIGTERM', () => bot.stop('SIGTERM'));
        this.bot = bot;
        this.bot.command('register', (ctx) => __awaiter(this, void 0, void 0, function* () { return yield this.registerUser(ctx, targetUsername); }));
    }
    registerUser(ctx, targetUsername) {
        return __awaiter(this, void 0, void 0, function* () {
            const chat = yield ctx.getChat();
            if (chat.username && chat.username === targetUsername) {
                this.chatId = chat.id;
                console.log(`Successfully registered the target user`);
                ctx.reply("Registration successful!");
            }
        });
    }
    start() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.bot.launch();
        });
    }
    onCurrentTasksResultsCommand(taskResults) {
        this.bot.command('results', (ctx) => __awaiter(this, void 0, void 0, function* () {
            const message = taskResults()
                .map(result => `${result.taskName}: ${result.taskResult}`)
                .join("\n");
            ctx.reply(message);
        }));
    }
    onValueChange(oldValue, newValue) {
        if (this.chatId) {
            const sanitizedOld = (oldValue !== null && oldValue !== void 0 ? oldValue : "").trim();
            const sanitizedNewValue = (newValue !== null && newValue !== void 0 ? newValue : "").trim();
            this.bot.telegram.sendMessage(this.chatId, `Value changed from [${sanitizedOld}] to [${sanitizedNewValue}]`);
        }
    }
    stop() {
        this.bot.stop("SIGTERM");
    }
}
exports.TelegramProcessor = TelegramProcessor;
