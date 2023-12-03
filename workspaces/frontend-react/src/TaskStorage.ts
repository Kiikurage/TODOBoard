import { Task } from './model/Task';

const LOCAL_STORAGE_KEY = 'TaskStorage';

export class TaskStorage {
    private readonly callbacks = new Set<() => void>();
    private tasks = new Map<string, Task>();

    constructor() {
        this.tasks = this.loadFromLS();
        this.addListener(() => this.saveToLS());
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

        this.callbacks.forEach((callback) => callback());
    }

    deleteById(taskId: string) {
        this.tasks = new Map(this.tasks);
        this.tasks.delete(taskId);

        this.callbacks.forEach((callback) => callback());
    }

    private serializeTask(task: Task): SerializedTask {
        return {
            id: task.id,
            title: task.title,
            completed: task.completed,
            description: task.description,
        };
    }

    private deserializeTask(serializedTask: SerializedTask): Task {
        return Task.create({
            id: serializedTask.id,
            title: serializedTask.title,
            completed: serializedTask.completed,
            description: serializedTask.description ?? '',
        });
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
    completed: boolean;
    description?: string;
}
