export class Point {
    constructor(
        public readonly x: number,
        public readonly y: number,
    ) {}

    copy(props: Partial<typeof Point.ownProps>): Point {
        return Object.assign(Object.create(Point.prototype), this, props);
    }

    equals(other: Point): boolean {
        return this.x === other.x && this.y === other.y;
    }

    static create(props: typeof this.ownProps) {
        return this.prototype.copy(props);
    }

    private static readonly ownProps = { ...this.prototype };

    static readonly EMPTY = this.create({ x: 0, y: 0 });

    toString(): string {
        return `Point(${this.x}, ${this.y})`;
    }
}
