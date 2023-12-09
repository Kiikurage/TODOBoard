import { Channel } from '../lib/channel/Channel';
import { BoardControllerEvents } from './BoardController';
import { Point } from '../lib/geometry/Point';
import { ch } from '../lib/channel/ch';
import { AbstractSession } from './AbstractSession';
import { Disposable, dispose } from '../lib/Disposable';

export class DragSessionState {
    constructor(
        public readonly completed: boolean,
        public readonly startPosition: Point,
        public readonly currentPosition: Point,
    ) {}

    get diff(): Point {
        return Point.create({
            x: this.currentPosition.x - this.startPosition.x,
            y: this.currentPosition.y - this.startPosition.y,
        });
    }

    complete(): DragSessionState {
        return this.copy({ completed: true });
    }

    static start(point: Point): DragSessionState {
        return DragSessionState.prototype.copy({ completed: false, startPosition: point, currentPosition: point });
    }

    move(point: Point): DragSessionState {
        if (this.completed) return this;

        return this.copy({ currentPosition: point });
    }

    copy(props: Partial<typeof ownProps>): DragSessionState {
        return Object.assign(Object.create(DragSessionState.prototype), this, props);
    }

    static create(props: typeof ownProps): DragSessionState {
        return DragSessionState.prototype.copy(props);
    }

    static readonly EMPTY = DragSessionState.create({
        completed: true,
        startPosition: Point.create({ x: 0, y: 0 }),
        currentPosition: Point.create({ x: 0, y: 0 }),
    });
}

const ownProps = { ...DragSessionState.prototype };

export class DragSession extends AbstractSession {
    public readonly state = ch.data(DragSessionState.EMPTY);
    public readonly onDragMove: Channel<DragSessionState> = new Channel();
    public readonly onDragEnd: Channel<DragSessionState> = new Channel();

    constructor(
        private readonly boardControllerEvents: BoardControllerEvents,
        startPoint: Point,
    ) {
        super();

        this.state.set(DragSessionState.start(startPoint));
        boardControllerEvents.onPointerMove.addListener(this.handlePointerMove);
        boardControllerEvents.onPointerUp.addListener(this.handlePointerUp);
    }

    [Disposable.dispose]() {
        super[Disposable.dispose]();

        this.boardControllerEvents.onPointerMove.removeListener(this.handlePointerMove);
        this.boardControllerEvents.onPointerUp.removeListener(this.handlePointerUp);

        dispose(this.state);
        dispose(this.onDragMove);
        dispose(this.onDragEnd);
    }

    private readonly handlePointerMove = (point: Point) => {
        this.state.set((oldState) => oldState.move(point));

        this.onDragMove.fire(this.state.get());
    };

    private readonly handlePointerUp = () => {
        this.state.set((oldState) => oldState.complete());

        this.onDragEnd.fire(this.state.get());
        dispose(this);
    };
}
