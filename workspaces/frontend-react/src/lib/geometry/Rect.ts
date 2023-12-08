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

    get p1() {
        return Point.create({ y: this.top, x: this.left });
    }

    get p2() {
        return Point.create({ y: this.top, x: this.right });
    }

    get p3() {
        return Point.create({ y: this.bottom, x: this.right });
    }

    get p4() {
        return Point.create({ y: this.bottom, x: this.left });
    }

    get center() {
        return Point.create({ y: this.top + this.height / 2, x: this.left + this.width / 2 });
    }

    get edges(): [l12: LineSegment, l14: LineSegment, l23: LineSegment, l43: LineSegment] {
        return [
            LineSegment.fromPoints(this.p1, this.p2),
            LineSegment.fromPoints(this.p1, this.p4),
            LineSegment.fromPoints(this.p2, this.p3),
            LineSegment.fromPoints(this.p4, this.p3),
        ];
    }

    copy(props: Partial<typeof ownProps>): Rect {
        return Object.assign(Object.create(Rect.prototype), this, props);
    }

    static create(props: typeof ownProps): Rect {
        return Rect.prototype.copy(props);
    }
}

const ownProps = { ...Rect.prototype };
