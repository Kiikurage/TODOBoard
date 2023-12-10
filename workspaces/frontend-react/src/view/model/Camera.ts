import { Point } from '../../lib/geometry/Point';

export class Camera {
    constructor(
        public readonly origin: Point,
        public readonly scale: number,
    ) {}

    toViewportPoint(displayPoint: Point): Point {
        return Point.create({
            x: displayPoint.x / this.scale + this.origin.x,
            y: displayPoint.y / this.scale + this.origin.y,
        });
    }

    toDisplayPoint(point: Point): Point {
        return Point.create({
            x: (point.x - this.origin.x) * this.scale,
            y: (point.y - this.origin.y) * this.scale,
        });
    }

    toViewportSize(displaySize: Point): Point {
        return Point.create({ x: displaySize.x / this.scale, y: displaySize.y / this.scale });
    }

    toDisplaySize(size: Point): Point {
        return Point.create({ x: size.x * this.scale, y: size.y * this.scale });
    }

    copy(props: Partial<typeof Camera.ownProps>): Camera {
        return Object.assign(Object.create(Camera.prototype), this, props);
    }

    static create(props: typeof this.ownProps) {
        return this.prototype.copy(props);
    }

    private static readonly ownProps = { ...this.prototype };

    static readonly EMPTY = this.create({ origin: Point.EMPTY, scale: 1 });
}
