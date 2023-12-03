export class Task {
    constructor(
        public readonly id: string,
        public readonly title: string,
        public readonly completed: boolean,
    ) {}

    setCompleted(completed: boolean): Task {
        return this.copy({ completed });
    }

    copy(props: Partial<typeof ownProps>): Task {
        return Object.assign(Object.create(Task.prototype), { ...this, ...props });
    }
}

const ownProps = { ...Task.prototype };
