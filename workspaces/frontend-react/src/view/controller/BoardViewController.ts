import { Point } from '../../lib/geometry/Point';
import { BoardController } from '../../controller/BoardController';
import { ReactiveStateMachine } from '../../lib/ReactiveStateMachine';
import { Rect } from '../../lib/geometry/Rect';
import { MoveViewportSession } from './MoveViewportSession';
import { Channel } from '../../lib/Channel';
import { DragSession } from './DragSession';

export class BoardViewState {
    constructor(public readonly viewportRect: Rect) {}

    copy(props: Partial<typeof BoardViewState.ownProps>): this {
        return Object.assign(Object.create(BoardViewState.prototype), this, props);
    }

    static empty() {
        return this.create({
            viewportRect: Rect.create({ left: 0, top: 0, width: 0, height: 0 }),
        });
    }

    static create(props: typeof this.ownProps) {
        return this.prototype.copy(props);
    }

    private static ownProps = { ...this.prototype };
}

export class BoardViewController extends ReactiveStateMachine<BoardViewState> {
    public readonly onPointerMove = new Channel<PointerEvent>();
    public readonly onPointerUp = new Channel<PointerEvent>();

    constructor(private readonly controller: BoardController) {
        super(BoardViewState.empty());
    }

    setViewportPosition(x: number, y: number) {
        this.state = this.state.copy({
            viewportRect: this.state.viewportRect.copy({ left: x, top: y }),
        });
    }

    setViewportSize(width: number, height: number) {
        if (this.state.viewportRect.width === width && this.state.viewportRect.height === height) return;

        this.state = this.state.copy({
            viewportRect: this.state.viewportRect.copy({ width, height }),
        });
    }

    readonly handleDoubleClick = (ev: MouseEvent) => {
        ev.stopPropagation();
        ev.preventDefault();
        this.controller.startCreateTaskSession(this.getPointFromMouseEvent(ev));
    };

    readonly handlePointerDown = (ev: PointerEvent) => {
        ev.stopPropagation();
        ev.preventDefault();

        if (ev.button === MouseButton.MIDDLE) {
            new MoveViewportSession(this.state.viewportRect.topLeft, new DragSession(this, ev), this);
        }

        this.controller.handlePointerDown(this.getPointFromMouseEvent(ev));
    };

    readonly handlePointerMove = (ev: PointerEvent) => {
        ev.stopPropagation();
        ev.preventDefault();
        this.onPointerMove.fire(ev);
        this.controller.handlePointerMove(this.getPointFromMouseEvent(ev));
    };

    readonly handlePointerUp = (ev: PointerEvent) => {
        ev.stopPropagation();
        ev.preventDefault();
        this.onPointerUp.fire(ev);
        this.controller.handlePointerUp(this.getPointFromMouseEvent(ev));
    };

    private getPointFromMouseEvent(ev: MouseEvent): Point {
        return Point.create({
            x: ev.clientX + this.state.viewportRect.left,
            y: ev.clientY + this.state.viewportRect.top,
        });
    }
}

enum MouseButton {
    LEFT = 0,
    MIDDLE = 1,
    RIGHT = 2,
    BACKWARD = 3,
    FORWARD = 4,
}
