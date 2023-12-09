import { Channel } from '../../lib/Channel';
import { Point } from '../../lib/geometry/Point';
import { AbstractSession } from '../../controller/AbstractSession';
import { Disposable, dispose } from '../../lib/Disposable';
import { BoardViewController } from './BoardViewController';

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

export class DragSession extends AbstractSession<DragSessionState> {
    public readonly onDragMove: Channel<DragSessionState> = new Channel();
    public readonly onDragEnd: Channel<DragSessionState> = new Channel();

    constructor(
        private readonly boardViewController: BoardViewController,
        pointerDownEvent: PointerEvent,
    ) {
        super(DragSessionState.start(Point.create({ x: pointerDownEvent.clientX, y: pointerDownEvent.clientY })));

        boardViewController.onPointerMove.addListener(this.handlePointerMove);
        boardViewController.onPointerUp.addListener(this.handlePointerUp);
    }

    [Disposable.dispose]() {
        this.boardViewController.onPointerMove.removeListener(this.handlePointerMove);
        this.boardViewController.onPointerUp.removeListener(this.handlePointerUp);

        dispose(this.onDragMove);
        dispose(this.onDragEnd);

        super[Disposable.dispose]();
    }

    private readonly handlePointerMove = (ev: PointerEvent) => {
        this.state = this.state.move(Point.create({ x: ev.clientX, y: ev.clientY }));

        this.onDragMove.fire(this.state);
    };

    private readonly handlePointerUp = () => {
        this.state = this.state.complete();

        this.onDragEnd.fire(this.state);
        dispose(this);
    };
}
