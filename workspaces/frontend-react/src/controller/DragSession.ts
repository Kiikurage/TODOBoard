import { Channel } from '../lib/Channel';
import { Vector2 } from '../lib/geometry/Vector2';
import { AbstractSession } from './AbstractSession';
import { Disposable, dispose } from '../lib/Disposable';
import { BoardViewController } from '../view/controller/BoardViewController';
import { Camera } from '../view/model/Camera';

export class DragSessionState {
    constructor(
        public readonly completed: boolean,
        public readonly startDisplayPosition: Vector2,
        public readonly startCamera: Camera,
        public readonly currentDisplayPosition: Vector2,
        public readonly currentCamera: Camera,
    ) {}

    get startPosition(): Vector2 {
        return this.startCamera.toViewportPoint(this.startDisplayPosition);
    }

    get currentPosition(): Vector2 {
        return this.currentCamera.toViewportPoint(this.currentDisplayPosition);
    }

    get displayDiff(): Vector2 {
        return new Vector2({
            x: this.currentDisplayPosition.x - this.startDisplayPosition.x,
            y: this.currentDisplayPosition.y - this.startDisplayPosition.y,
        });
    }

    get diff(): Vector2 {
        return new Vector2({
            x: this.currentPosition.x - this.startPosition.x,
            y: this.currentPosition.y - this.startPosition.y,
        });
    }

    complete(): DragSessionState {
        return this.copy({ completed: true });
    }

    static start(displayPosition: Vector2, camera: Camera): DragSessionState {
        return DragSessionState.prototype.copy({
            completed: false,
            startDisplayPosition: displayPosition,
            startCamera: camera,
            currentDisplayPosition: displayPosition,
            currentCamera: camera,
        });
    }

    setDisplayPosition(displayPosition: Vector2): DragSessionState {
        if (this.completed) return this;

        return this.copy({ currentDisplayPosition: displayPosition });
    }

    setCamera(camera: Camera): DragSessionState {
        if (this.completed) return this;

        return this.copy({ currentCamera: camera });
    }

    copy(props: Partial<typeof DragSessionState.ownProps>): DragSessionState {
        return Object.assign(Object.create(DragSessionState.prototype), this, props);
    }

    static create(props: typeof this.ownProps) {
        return this.prototype.copy(props);
    }

    private static readonly ownProps = { ...this.prototype };

    static readonly EMPTY = this.create({
        completed: true,
        startDisplayPosition: Vector2.EMPTY,
        startCamera: Camera.EMPTY,
        currentDisplayPosition: Vector2.EMPTY,
        currentCamera: Camera.EMPTY,
    });
}

export class DragSession extends AbstractSession<DragSessionState> {
    public readonly onDragMove: Channel<DragSessionState> = new Channel();
    public readonly onDragEnd: Channel<DragSessionState> = new Channel();

    constructor(
        private readonly boardViewController: BoardViewController,
        startDisplayPosition: Vector2,
    ) {
        super(DragSessionState.start(startDisplayPosition, boardViewController.state.camera));

        boardViewController.onCameraChange.addListener(this.handleCameraChange);
        boardViewController.onPointerMove.addListener(this.handlePointerMove);
        boardViewController.onPointerUp.addListener(this.handlePointerUp);
    }

    [Disposable.dispose]() {
        this.boardViewController.onCameraChange.removeListener(this.handleCameraChange);
        this.boardViewController.onPointerMove.removeListener(this.handlePointerMove);
        this.boardViewController.onPointerUp.removeListener(this.handlePointerUp);

        dispose(this.onDragMove);
        dispose(this.onDragEnd);

        super[Disposable.dispose]();
    }

    private readonly handleCameraChange = (camera: Camera) => {
        this.state = this.state.setCamera(camera);
    };

    private readonly handlePointerMove = (ev: PointerEvent) => {
        this.state = this.state.setDisplayPosition(new Vector2({ x: ev.clientX, y: ev.clientY }));
        this.onDragMove.fire(this.state);
    };

    private readonly handlePointerUp = () => {
        this.state = this.state.complete();

        this.onDragEnd.fire(this.state);
        dispose(this);
    };
}
