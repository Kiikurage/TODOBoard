import { Point } from './Point';
import { LineSegment } from './LineSegment';

export class Rect {
    constructor(
        public readonly top: number,
        public readonly left: number,
        public readonly width: number,
        public readonly height: number,
    ) {}

    get right() {
        return this.left + this.width;
    }

    get bottom() {
        return this.top + this.height;
    }

    get topLeft() {
        return Point.create({ y: this.top, x: this.left });
    }

    get topRight() {
        return Point.create({ y: this.top, x: this.right });
    }

    get bottomRight() {
        return Point.create({ y: this.bottom, x: this.right });
    }

    get bottomLeft() {
        return Point.create({ y: this.bottom, x: this.left });
    }

    get center() {
        return Point.create({ y: this.top + this.height / 2, x: this.left + this.width / 2 });
    }

    get edges(): [l12: LineSegment, l14: LineSegment, l23: LineSegment, l43: LineSegment] {
        return [
            LineSegment.fromPoints(this.topLeft, this.topRight),
            LineSegment.fromPoints(this.topLeft, this.bottomLeft),
            LineSegment.fromPoints(this.topRight, this.bottomRight),
            LineSegment.fromPoints(this.bottomLeft, this.bottomRight),
        ];
    }

    copy(props: Partial<typeof Rect.ownProps>): Rect {
        return Object.assign(Object.create(Rect.prototype), this, props);
    }

    static create(props: typeof this.ownProps) {
        return this.prototype.copy(props);
    }

    private static readonly ownProps = { ...this.prototype };

    toString(): string {
        return `Rect(${this.left}, ${this.top}, ${this.width}, ${this.height})`;
    }
}
