import { Point } from '../../lib/geometry/Point';
import { BoardController, BoardState } from '../../controller/BoardController';
import { ReactiveStateMachine } from '../../lib/ReactiveStateMachine';
import { Rect } from '../../lib/geometry/Rect';
import { MoveViewportSession } from './MoveViewportSession';
import { Channel } from '../../lib/Channel';
import { DragSession } from '../../controller/DragSession';
import { Camera } from '../model/Camera';
import { Disposable } from '../../lib/Disposable';
import { Task } from '../../model/Task';

export class BoardViewState {
    constructor(
        public readonly camera: Camera,
        public readonly size: Point,
        public readonly boardState: BoardState,
    ) {}

    get rect(): Rect {
        return Rect.create({
            left: this.camera.origin.x,
            top: this.camera.origin.y,
            width: this.size.x,
            height: this.size.y,
        });
    }
    setCameraOrigin(origin: Point) {
        if (origin.equals(this.camera.origin)) return this;

        return this.copy({
            camera: this.camera.copy({ origin }),
        });
    }

    setDisplayCameraOrigin(displayOrigin: Point) {
        return this.setCameraOrigin(this.camera.toViewportPoint(displayOrigin));
    }

    setSize(size: Point) {
        if (size.equals(this.size)) return this;

        return this.copy({ size });
    }

    setDisplaySize(displayOrigin: Point) {
        return this.setSize(this.camera.toViewportSize(displayOrigin));
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
        size: Point.EMPTY,
        boardState: BoardState.EMPTY,
    });
}

export class BoardViewController extends ReactiveStateMachine<BoardViewState> {
    public readonly onCameraChange = new Channel<Camera>();
    public readonly onPointerMove = new Channel<PointerEvent>();
    public readonly onPointerUp = new Channel<PointerEvent>();

    constructor(private readonly controller: BoardController) {
        super(BoardViewState.EMPTY);

        this.controller.onChange.addListener(this.handleControllerChange);
    }

    [Disposable.dispose]() {
        super[Disposable.dispose]();

        this.controller.onChange.removeListener(this.handleControllerChange);
    }

    get taskRepository() {
        return this.controller.taskRepository;
    }

    get linkRepository() {
        return this.controller.linkRepository;
    }

    setCameraOrigin(origin: Point) {
        this.state = this.state.setCameraOrigin(origin);
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

        if (ev.button === MouseButton.MIDDLE) {
            new MoveViewportSession(
                this.state.camera,
                new DragSession(this, this.getDisplayPointFromMouseEvent(ev)),
                this,
            );
        }
    };

    readonly handlePointerMove = (ev: PointerEvent) => {
        ev.stopPropagation();
        ev.preventDefault();
        this.onPointerMove.fire(ev);
    };

    readonly handlePointerUp = (ev: PointerEvent) => {
        ev.stopPropagation();
        ev.preventDefault();
        this.onPointerUp.fire(ev);
    };

    readonly handleTaskDragHandlePointerDown = (ev: PointerEvent, taskId: string) => {
        this.controller.startMoveTaskSession(taskId, new DragSession(this, this.getDisplayPointFromMouseEvent(ev)));
    };

    readonly handleCreateLinkButtonPointerDown = (ev: PointerEvent, taskId: string) => {
        this.controller.startCreateLinkSession(taskId, new DragSession(this, this.getDisplayPointFromMouseEvent(ev)));
    };

    readonly handleTaskPointerEnter = (taskId: string) => {
        this.controller.handleTaskPointerEnter(taskId);
    };

    readonly handleTaskPointerLeave = (taskId: string) => {
        this.controller.handleTaskPointerLeave(taskId);
    };

    private readonly handleControllerChange = () => {
        this.state = this.state.copy({ boardState: this.controller.state });
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
