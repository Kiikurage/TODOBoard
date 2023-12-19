import { Vector2 } from '../../lib/geometry/Vector2';
import { ReactiveStateMachine } from '../../lib/ReactiveStateMachine';
import { Rect } from '../../lib/geometry/Rect';
import { MoveViewportSession } from './MoveViewportSession';
import { Channel } from '../../lib/Channel';
import { DragSession } from '../../controller/DragSession';
import { Camera } from '../model/Camera';

export class BoardViewState {
    constructor(
        public readonly camera: Camera,
        public readonly size: Vector2,
    ) {}

    get rect(): Rect {
        return new Rect({
            left: this.camera.origin.x,
            top: this.camera.origin.y,
            width: this.size.x,
            height: this.size.y,
        });
    }

    setCameraOrigin(origin: Vector2) {
        if (origin.equals(this.camera.origin)) return this;

        return this.copy({
            camera: this.camera.copy({ origin }),
        });
    }

    setDisplayCameraOrigin(displayOrigin: Vector2) {
        return this.setCameraOrigin(this.camera.toViewportPoint(displayOrigin));
    }

    setSize(size: Vector2) {
        if (size.equals(this.size)) return this;

        return this.copy({ size });
    }

    setDisplaySize(displayOrigin: Vector2) {
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
        size: Vector2.EMPTY,
    });
}

export class BoardViewController extends ReactiveStateMachine<BoardViewState> {
    public readonly onCameraChange = new Channel<Camera>();
    public readonly onPointerMove = new Channel<PointerEvent>();
    public readonly onPointerUp = new Channel<PointerEvent>();

    constructor() {
        super(BoardViewState.EMPTY);
    }

    setCameraOrigin(origin: Vector2) {
        this.state = this.state.setCameraOrigin(origin);
        this.onCameraChange.fire(this.state.camera);
    }

    setDisplaySize(displaySize: Vector2) {
        this.state = this.state.setDisplaySize(displaySize);
        this.onCameraChange.fire(this.state.camera);
    }

    readonly handlePointerDown = (ev: PointerEvent) => {
        ev.stopPropagation();

        if (ev.button === MouseButton.MIDDLE) {
            new MoveViewportSession(new DragSession(this, this.getDisplayPointFromMouseEvent(ev)), this);
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

    private getDisplayPointFromMouseEvent(ev: MouseEvent): Vector2 {
        return new Vector2({ x: ev.clientX, y: ev.clientY });
    }
}

enum MouseButton {
    LEFT = 0,
    MIDDLE = 1,
    RIGHT = 2,
    BACKWARD = 3,
    FORWARD = 4,
}
