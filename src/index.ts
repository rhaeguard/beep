import fetch from 'node-fetch';
import { HTMLElement, parse } from 'node-html-parser';
import { uuid } from 'uuidv4';

type TaskCallback = (html: HTMLElement) => string

interface Task {
    id: string,
    title: string,
    resource: string,
    onHtmlResult: TaskCallback
}

const newTask = (title: string, resource: string, onHtmlResult: TaskCallback) => {
    const id = uuid();
    return {
        id, title, resource, onHtmlResult
    }
}

class Engine {
    private taskResultsByTaskId: Map<string, string>;
    private tasks: Task[];

    constructor(tasks: Task[]) {
        this.tasks = tasks;
        this.taskResultsByTaskId = new Map<string, string>()
    }

    start() {
        this.tasks.forEach(task => {
            setInterval(this.performTask.bind(this, task), 10_000)
        })
    }

    async performTask(task: Task) {
        const taskResult = await this.runTask(task);
        this.updateTaskResult(task, taskResult)
    }

    updateTaskResult(task: Task, taskResult: string | null) {
        if (taskResult) {
            if (taskResult != this.taskResultsByTaskId.get(task.id)) {
                this.taskResultsByTaskId.set(task.id, taskResult);
                console.log(`Task[${task.id}] has been set to ${taskResult}`)
            }
        }
    }

    async runTask(task: Task): Promise<string | null> {
        try {
            const resource = await fetch(task.resource)
            const text = await resource.text()
            const root = parse(text);
            const result = task.onHtmlResult(root);
            return result
        } catch (error) {
            return null;
        }
    }
}

async function main() {
    const tasks: Task[] = [
        newTask("Economy book price change", `https://www.amazon.ca/Economics-Book-Ideas-Simply-Explained/dp/1465473912/`, dom => {
            return dom.querySelector(`#price`)?.innerText ?? ""
        })
    ]

    const engine = new Engine(tasks);
    engine.start()
}

main();