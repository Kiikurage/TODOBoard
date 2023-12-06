export class Point {
    constructor(
        public readonly x: number,
        public readonly y: number,
    ) {}

    copy(props: Partial<typeof ownProps>): Point {
        return Object.assign(Object.create(Point.prototype), this, props);
    }

    static create(props: typeof ownProps): Point {
        return Point.prototype.copy(props);
    }
}

const ownProps = { ...Point.prototype };
