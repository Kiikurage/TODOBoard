import { Point } from '../../lib/geometry/Point';

export class Camera {
    constructor(
        public readonly viewportOrigin: Point,
        public readonly scale: number,
    ) {}

    toViewportPoint(displayPoint: Point): Point {
        return Point.create({
            x: displayPoint.x / this.scale + this.viewportOrigin.x,
            y: displayPoint.y / this.scale + this.viewportOrigin.y,
        });
    }

    toDisplayPoint(viewportPoint: Point): Point {
        return Point.create({
            x: (viewportPoint.x - this.viewportOrigin.x) * this.scale,
            y: (viewportPoint.y - this.viewportOrigin.y) * this.scale,
        });
    }

    toViewportSize(displaySize: Point): Point {
        return Point.create({ x: displaySize.x / this.scale, y: displaySize.y / this.scale });
    }

    toDisplaySize(viewportSize: Point): Point {
        return Point.create({ x: viewportSize.x * this.scale, y: viewportSize.y * this.scale });
    }

    copy(props: Partial<typeof Camera.ownProps>): Camera {
        return Object.assign(Object.create(Camera.prototype), this, props);
    }

    static create(props: typeof this.ownProps) {
        return this.prototype.copy(props);
    }

    private static readonly ownProps = { ...this.prototype };

    static readonly EMPTY = this.create({ viewportOrigin: Point.EMPTY, scale: 1 });
}
