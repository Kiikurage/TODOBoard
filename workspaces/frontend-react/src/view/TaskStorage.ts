import { Task } from '../model/Task';

const LOCAL_STORAGE_KEY = 'TaskStorage';

export class TaskStorage {
    private readonly callbacks = new Set<() => void>();
    private tasks = new Map<string, Task>();

    constructor() {
        this.tasks = this.loadFromLS();
    }

    addListener(callback: () => void) {
        this.callbacks.add(callback);
    }

    removeListener(callback: () => void) {
        this.callbacks.delete(callback);
    }

    readAll(): ReadonlyMap<string, Task> {
        return this.tasks;
    }

    save(task: Task) {
        this.tasks = new Map(this.tasks);
        this.tasks.set(task.id, task);

        this.saveToLS();
        this.callbacks.forEach((callback) => callback());
    }

    private serializeTask(task: Task): SerializedTask {
        return {
            id: task.id,
            title: task.title,
        };
    }

    private deserializeTask(serializedTask: SerializedTask): Task {
        return new Task(serializedTask.id, serializedTask.title);
    }

    private saveToLS() {
        const serializedTasks = [...this.tasks.values()].map((task) => this.serializeTask(task));

        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(serializedTasks));
    }

    private loadFromLS(): Map<string, Task> {
        let serializedTasks: SerializedTask[];
        try {
            serializedTasks = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) ?? '[]') as SerializedTask[];
        } catch {
            serializedTasks = [];
        }

        const tasks = serializedTasks.map((serializedTask) => this.deserializeTask(serializedTask));

        const map = new Map<string, Task>();
        for (const task of tasks) map.set(task.id, task);

        return map;
    }
}

interface SerializedTask {
    id: string;
    title: string;
}
