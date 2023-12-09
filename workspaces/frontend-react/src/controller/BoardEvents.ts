import { Channel } from '../lib/Channel';
import { Point } from '../lib/geometry/Point';

export interface BoardEvents {
    readonly onPointerDown: Channel<Point>;
    readonly onPointerMove: Channel<Point>;
    readonly onPointerUp: Channel<Point>;
    readonly onTaskPointerEnter: Channel<{ taskId: string; point: Point }>;
    readonly onTaskPointerLeave: Channel<{ taskId: string; point: Point }>;
}
