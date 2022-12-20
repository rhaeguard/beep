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
    private tasksById: Map<string, Task>;
    private tasks: Task[];

    constructor(tasks: Task[]) {
        this.tasks = tasks;
        this.tasksById = new Map<string, Task>(tasks.map(task => [task.id, task]))
    }

    start() {
        this.tasks.forEach(task => {
            setInterval(() => {
                Engine.runTask(task)
            }, 10_000)
        })
    }

    static async runTask(task: Task) {
        const resource = await fetch(task.resource)
        const text = await resource.text()
        const root = parse(text);
        const result = task.onHtmlResult(root);
        console.log(`Result for the task[${task.id}]::${result}`)
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