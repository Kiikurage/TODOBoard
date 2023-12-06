import { Point } from './Point';
import { Rect } from './Rect';
import { LineSegment } from './LineSegment';

export class Line {
    constructor(
        public readonly a: number,
        public readonly b: number,
        public readonly c: number,
    ) {}

    copy(props: Partial<typeof ownProps>): Line {
        return Object.assign(Object.create(Line.prototype), this, props);
    }

    static create(props: typeof ownProps): Line {
        return Line.prototype.copy(props);
    }

    static fromPoints(p1: Point, p2: Point): Line {
        const { x: x1, y: y1 } = p1;
        const { x: x2, y: y2 } = p2;

        return Line.create({ a: x2 - x1, b: y1 - y2, c: x1 * y2 - x2 * y1 });
    }
}

const ownProps = { ...Line.prototype };

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

export function getIntersectionPointForLineSegmentAndRect(line: LineSegment, rect: Rect): Point | null {
    const { p1: lineP1, p2: lineP2 } = line;

    if (lineP1.x === lineP2.x && lineP1.y === lineP2.y) return null;

    const line1 = Line.fromPoints(lineP1, lineP2);

    for (const [rectP1, rectP2] of [
        [rect.p1, rect.p2],
        [rect.p1, rect.p4],
        [rect.p2, rect.p3],
        [rect.p4, rect.p3],
    ]) {
        const line2 = Line.fromPoints(rectP1, rectP2);

        const point = getIntersectionPointForLineAndLine(line1, line2);
        if (point === null) continue;

        if (point.x < Math.min(rectP1.x, rectP2.x)) continue;
        if (point.x > Math.max(rectP1.x, rectP2.x)) continue;
        if (point.y < Math.min(rectP1.y, rectP2.y)) continue;
        if (point.y > Math.max(rectP1.y, rectP2.y)) continue;

        if (point.x < Math.min(lineP1.x, lineP2.x)) continue;
        if (point.x > Math.max(lineP1.x, lineP2.x)) continue;
        if (point.y < Math.min(lineP1.y, lineP2.y)) continue;
        if (point.y > Math.max(lineP1.y, lineP2.y)) continue;

        return point;
    }

    return null;
}
