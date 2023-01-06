import { Engine, newTask } from "beep";

async function main() {
    const tasks = [
        newTask(
            "Watching the changes made to my canvas app",
            `https://shared-canvas.vercel.app/`,
            dom => {
                return dom.querySelector(`body > div.container > div > h1`)?.innerText ?? ""
            },
            null,
            (oldValue, newValue) => {
                console.log(`It was previously: ${oldValue}`);
                console.log(`Now it is: ${newValue}`)
            }
        )
    ]

    new Engine(tasks).start();
}

main();