export class Task {
    protected constructor(
        public readonly id: string,
        public readonly title: string,
        public readonly completed: boolean,
        public readonly description: string,
        public readonly x: number,
        public readonly y: number,
        public readonly dependencies: ReadonlySet<string>,
    ) {}

    setDescription(description: string): Task {
        return this.copy({ description });
    }

    addDependency(taskId: string): Task {
        return this.copy({
            dependencies: new Set([...this.dependencies, taskId]),
        });
    }
    setCompleted(completed: boolean): Task {
        return this.copy({ completed });
    }

    copy(props: Partial<typeof ownProps>): Task {
        return Object.assign(Object.create(Task.prototype), { ...this, ...props });
    }

    static create(props: typeof ownProps): Task {
        return Object.assign(Object.create(Task.prototype), props);
    }
}

const ownProps = { ...Task.prototype };
