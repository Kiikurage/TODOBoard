import { Channel } from '../lib/Channel';
import { Vector2 } from '../lib/geometry/Vector2';
import { Session } from './Session';
import { Disposable, dispose } from '../lib/Disposable';
import { BoardViewController } from '../view/controller/BoardViewController';
import { Camera } from '../view/model/Camera';
import { dataclass } from '../lib/dataclass';

export class DragSessionState extends dataclass<{
    completed: boolean;
    startDisplayPosition: Vector2;
    startCamera: Camera;
    currentDisplayPosition: Vector2;
    currentCamera: Camera;
}>() {
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

    static readonly EMPTY = new DragSessionState({
        completed: true,
        startDisplayPosition: Vector2.EMPTY,
        startCamera: Camera.EMPTY,
        currentDisplayPosition: Vector2.EMPTY,
        currentCamera: Camera.EMPTY,
    });
}

export class DragSession extends Session<DragSessionState> {
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
