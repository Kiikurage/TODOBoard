import { Task } from '../model/Task';

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

    readAll(includeArchivedTasks: boolean = false): ReadonlyMap<string, Task> {
        if (includeArchivedTasks) {
            return this.tasks;
        }

        const map = new Map<string, Task>();
        for (const task of this.tasks.values()) {
            if (task.isArchived) continue;

            map.set(task.id, task);
        }

        return map;
    }

    save(task: Task) {
        this.tasks = new Map(this.tasks);
        this.tasks.set(task.id, task);

        this.callbacks.forEach((callback) => callback());
    }

    moveTaskToFront(taskId: string) {
        const task = this.tasks.get(taskId);
        if (task === undefined) return;

        this.tasks = new Map(this.tasks);
        this.tasks.delete(taskId);
        this.tasks.set(taskId, task);

        this.callbacks.forEach((callback) => callback());
    }

    private serializeTask(task: Task): SerializedTask {
        return {
            id: task.id,
            title: task.title,
            completed: task.completed,
            description: task.description,
            isArchived: task.isArchived,
            x: task.x,
            y: task.y,
        };
    }

    private deserializeTask(serializedTask: SerializedTask): Task {
        return Task.create({
            id: serializedTask.id,
            title: serializedTask.title,
            completed: serializedTask.completed,
            description: serializedTask.description,
            isArchived: serializedTask.isArchived ?? false,
            x: serializedTask.x,
            y: serializedTask.y,
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
    description: string;
    isArchived: boolean;
    x: number;
    y: number;
}
