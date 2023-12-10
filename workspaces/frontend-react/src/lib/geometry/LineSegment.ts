import { Point } from './Point';

export class LineSegment {
    constructor(
        public readonly p1: Point,
        public readonly p2: Point,
    ) {}

    get length() {
        return ((this.p1.x - this.p2.x) ** 2 + (this.p1.y - this.p2.y) ** 2) ** (1 / 2);
    }

    copy(props: Partial<typeof LineSegment.ownProps>): LineSegment {
        return Object.assign(Object.create(LineSegment.prototype), this, props);
    }

    static create(props: typeof this.ownProps) {
        return this.prototype.copy(props);
    }

    private static readonly ownProps = { ...this.prototype };

    static fromPoints(p1: Point, p2: Point) {
        return this.create({ p1, p2 });
    }
}
