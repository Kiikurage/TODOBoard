import { Point } from './Point';
import { Rect } from './Rect';
import { LineSegment } from './LineSegment';
import { isNotNullish } from '../isNotNullish';

export class Line {
    constructor(
        public readonly a: number,
        public readonly b: number,
        public readonly c: number,
    ) {}

    copy(props: Partial<typeof Line.ownProps>): Line {
        return Object.assign(Object.create(Line.prototype), this, props);
    }

    static create(props: typeof this.ownProps) {
        return this.prototype.copy(props);
    }

    private static readonly ownProps = { ...this.prototype };

    static fromPoints(p1: Point, p2: Point) {
        const { x: x1, y: y1 } = p1;
        const { x: x2, y: y2 } = p2;

        return this.create({ a: x2 - x1, b: y1 - y2, c: x1 * y2 - x2 * y1 });
    }
}

export function getIntersectionPointForLineAndLine(line1: Line, line2: Line): Point | null {
    const { a: a1, b: b1, c: c1 } = line1;
    const { a: a2, b: b2, c: c2 } = line2;

    const denominator = a1 * b2 - a2 * b1;
    if (denominator === 0) return null;

    return Point.create({
        x: (a2 * c1 - a1 * c2) / denominator,
        y: (b1 * c2 - b2 * c1) / denominator,
    });
}

export function getIntersectionPointForLineSegmentAndRect(lineSegment1: LineSegment, rect: Rect): Point[] {
    return rect.edges
        .map((lineSegment2) => getIntersectionPointForLineSegmentAndLineSegment(lineSegment1, lineSegment2))
        .filter(isNotNullish);
}

export function getIntersectionPointForLineSegmentAndLineSegment(
    lineSegment1: LineSegment,
    lineSegment2: LineSegment,
): Point | null {
    if (lineSegment1.length === 0 || lineSegment2.length === 0) return null;

    const line1 = Line.fromPoints(lineSegment1.p1, lineSegment1.p2);
    const line2 = Line.fromPoints(lineSegment2.p1, lineSegment2.p2);

    const point = getIntersectionPointForLineAndLine(line1, line2);
    if (point === null) return null;

    if (point.x < Math.min(lineSegment1.p1.x, lineSegment1.p2.x)) return null;
    if (point.x > Math.max(lineSegment1.p1.x, lineSegment1.p2.x)) return null;
    if (point.y < Math.min(lineSegment1.p1.y, lineSegment1.p2.y)) return null;
    if (point.y > Math.max(lineSegment1.p1.y, lineSegment1.p2.y)) return null;

    if (point.x < Math.min(lineSegment2.p1.x, lineSegment2.p2.x)) return null;
    if (point.x > Math.max(lineSegment2.p1.x, lineSegment2.p2.x)) return null;
    if (point.y < Math.min(lineSegment2.p1.y, lineSegment2.p2.y)) return null;
    if (point.y > Math.max(lineSegment2.p1.y, lineSegment2.p2.y)) return null;

    return point;
}
