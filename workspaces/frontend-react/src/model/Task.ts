import { Rect } from '../lib/geometry/Rect';

export class Task {
    protected constructor(
        public readonly id: string,
        public readonly title: string,
        public readonly completed: boolean,
        public readonly description: string,
        public rect: Rect,
    ) {}

    copy(props: Partial<typeof Task.ownProps>): Task {
        return Object.assign(Object.create(Task.prototype), { ...this, ...props });
    }

    equalTo(other: Task): boolean {
        return (Object.keys({ ...this }) as (keyof Task)[]).every((key) => this[key] === other[key]);
    }

    static create(props: typeof this.ownProps) {
        return this.prototype.copy(props);
    }

    private static readonly ownProps = { ...this.prototype };
}
