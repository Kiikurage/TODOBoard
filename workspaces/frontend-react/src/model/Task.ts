export class Task {
    constructor(
        public readonly id: string,
        public readonly title: string,
    ) {}

    setTitle(title: string): Task {
        return this.copy({ title });
    }

    copy(props: Partial<typeof ownProps>): Task {
        return Object.assign(Object.create(Task.prototype), { ...this, ...props });
    }
}

const ownProps = { ...Task.prototype };
