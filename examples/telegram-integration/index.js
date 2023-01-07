import { Engine, newTask } from "beep";
import { TelegramProcessor } from "beep/integration/telegram.js";
import dotEnv from "dotenv";

dotEnv.config();

async function main() {
    const bot = new TelegramProcessor(
        process.env.BOT_TOKEN,
        process.env.TELEGRAM_USERNAME
    )

    const tasks = [
        newTask(
            "Watching the time change",
            `https://time.is/`,
            dom =>  dom.querySelector(`#clock`)?.innerText ?? "",
            null,
            (oldVal, newVal) => bot.onValueChange(oldVal, newVal)
        )
    ]

    const engine = new Engine(tasks);

    bot.onCurrentTasksResultsCommand(() => engine.getCurrentTaskResults())
    await bot.start();

    engine.start();
}

main();