export class Task {
    protected constructor(
        public readonly id: string,
        public readonly title: string,
        public readonly completed: boolean,
        public readonly description: string,
        public readonly x: number,
        public readonly y: number,
        public readonly width: number,
        public readonly height: number,
    ) {}

    copy(props: Partial<typeof ownProps>): Task {
        return Object.assign(Object.create(Task.prototype), { ...this, ...props });
    }

    static create(props: typeof ownProps): Task {
        return Object.assign(Object.create(Task.prototype), props);
    }
}

const ownProps = { ...Task.prototype };
