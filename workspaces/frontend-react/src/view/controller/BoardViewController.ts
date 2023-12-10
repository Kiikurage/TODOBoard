import { Point } from '../../lib/geometry/Point';
import { BoardController } from '../../controller/BoardController';
import { ReactiveStateMachine } from '../../lib/ReactiveStateMachine';
import { Rect } from '../../lib/geometry/Rect';
import { MoveViewportSession } from './MoveViewportSession';
import { Channel } from '../../lib/Channel';
import { DragSession } from '../../controller/DragSession';
import { Camera } from '../model/Camera';

export class BoardViewState {
    constructor(
        public readonly camera: Camera,
        public readonly viewportSize: Point,
    ) {}

    get viewportRect(): Rect {
        return Rect.create({
            left: this.camera.viewportOrigin.x,
            top: this.camera.viewportOrigin.y,
            width: this.viewportSize.x,
            height: this.viewportSize.y,
        });
    }

    setViewportCameraOrigin(viewportOrigin: Point) {
        if (viewportOrigin.equals(this.camera.viewportOrigin)) return this;

        return this.copy({
            camera: this.camera.copy({ viewportOrigin }),
        });
    }

    setDisplayCameraOrigin(displayOrigin: Point) {
        return this.setViewportCameraOrigin(this.camera.toViewportPoint(displayOrigin));
    }

    setViewportSize(viewportSize: Point) {
        if (viewportSize.equals(this.viewportSize)) return this;

        return this.copy({ viewportSize });
    }

    setDisplaySize(displayOrigin: Point) {
        return this.setViewportSize(this.camera.toViewportSize(displayOrigin));
    }

    copy(props: Partial<typeof BoardViewState.ownProps>): this {
        return Object.assign(Object.create(BoardViewState.prototype), this, props);
    }

    static create(props: typeof this.ownProps) {
        return this.prototype.copy(props);
    }

    private static readonly ownProps = { ...this.prototype };

    static readonly EMPTY = this.create({
        camera: Camera.EMPTY,
        viewportSize: Point.EMPTY,
    });
}

export class BoardViewController extends ReactiveStateMachine<BoardViewState> {
    public readonly onCameraChange = new Channel<Camera>();
    public readonly onPointerMove = new Channel<PointerEvent>();
    public readonly onPointerUp = new Channel<PointerEvent>();

    constructor(private readonly controller: BoardController) {
        super(BoardViewState.EMPTY);
    }

    setViewportCameraOrigin(viewportOrigin: Point) {
        this.state = this.state.setViewportCameraOrigin(viewportOrigin);
        this.onCameraChange.fire(this.state.camera);
    }

    setDisplayCameraOrigin(displayOrigin: Point) {
        this.state = this.state.setDisplayCameraOrigin(displayOrigin);
        this.onCameraChange.fire(this.state.camera);
    }

    setViewportSize(viewportSize: Point) {
        this.state = this.state.setViewportSize(viewportSize);
        this.onCameraChange.fire(this.state.camera);
    }

    setDisplaySize(displaySize: Point) {
        this.state = this.state.setDisplaySize(displaySize);
        this.onCameraChange.fire(this.state.camera);
    }

    readonly handleDoubleClick = (ev: MouseEvent) => {
        ev.stopPropagation();
        ev.preventDefault();
        this.controller.startCreateTaskSession(this.getViewportPointFromMouseEvent(ev));
    };

    readonly handlePointerDown = (ev: PointerEvent) => {
        ev.stopPropagation();
        ev.preventDefault();

        if (ev.button === MouseButton.MIDDLE) {
            new MoveViewportSession(
                this.state.camera,
                new DragSession(this, this.getDisplayPointFromMouseEvent(ev)),
                this,
            );
        }

        this.controller.handlePointerDown(this.getViewportPointFromMouseEvent(ev));
    };

    readonly handlePointerMove = (ev: PointerEvent) => {
        ev.stopPropagation();
        ev.preventDefault();
        this.onPointerMove.fire(ev);
        this.controller.handlePointerMove(this.getViewportPointFromMouseEvent(ev));
    };

    readonly handlePointerUp = (ev: PointerEvent) => {
        ev.stopPropagation();
        ev.preventDefault();
        this.onPointerUp.fire(ev);
        this.controller.handlePointerUp(this.getViewportPointFromMouseEvent(ev));
    };

    readonly handleTaskDragHandlePointerDown = (ev: PointerEvent, taskId: string) => {
        this.controller.startMoveTaskSession(taskId, new DragSession(this, this.getDisplayPointFromMouseEvent(ev)));
    };

    readonly handleCreateLinkButtonPointerDown = (ev: PointerEvent, taskId: string) => {
        this.controller.startCreateLinkSession(taskId, new DragSession(this, this.getDisplayPointFromMouseEvent(ev)));
    };

    private getDisplayPointFromMouseEvent(ev: MouseEvent): Point {
        return Point.create({ x: ev.clientX, y: ev.clientY });
    }

    private getViewportPointFromMouseEvent(ev: MouseEvent): Point {
        return this.state.camera.toViewportPoint(this.getDisplayPointFromMouseEvent(ev));
    }
}

enum MouseButton {
    LEFT = 0,
    MIDDLE = 1,
    RIGHT = 2,
    BACKWARD = 3,
    FORWARD = 4,
}
