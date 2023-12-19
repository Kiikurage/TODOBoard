import { Vector2 } from '../../lib/geometry/Vector2';
import { dataclass } from '../../lib/dataclass';

export class Camera extends dataclass<{
    origin: Vector2;
    scale: number;
}>() {
    toViewportPoint(displayPoint: Vector2): Vector2 {
        return new Vector2({
            x: displayPoint.x / this.scale + this.origin.x,
            y: displayPoint.y / this.scale + this.origin.y,
        });
    }

    toDisplayPoint(point: Vector2): Vector2 {
        return new Vector2({
            x: (point.x - this.origin.x) * this.scale,
            y: (point.y - this.origin.y) * this.scale,
        });
    }

    toViewportSize(displaySize: Vector2): Vector2 {
        return new Vector2({ x: displaySize.x / this.scale, y: displaySize.y / this.scale });
    }

    toDisplaySize(size: Vector2): Vector2 {
        return new Vector2({ x: size.x * this.scale, y: size.y * this.scale });
    }

    static readonly EMPTY = new Camera({ origin: Vector2.EMPTY, scale: 1 });
}
