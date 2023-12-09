import { Channel } from '../lib/Channel';
import { Point } from '../lib/geometry/Point';
import { DragSession } from './DragSession';
import { CreateLinkSession } from './CreateLinkSession';
import { MoveTaskSession } from './MoveTaskSession';
import { CreateTaskSession } from './CreateTaskSession';
import { TaskRepository } from '../model/repository/TaskRepository';
import { LinkRepository } from '../model/repository/LinkRepository';
import { ReactiveStateMachine } from '../lib/ReactiveStateMachine';
import { Disposable, dispose } from '../lib/Disposable';

export class BoardState {
    constructor(
        public readonly dragSession: DragSession | null,
        public readonly moveTaskSession: MoveTaskSession | null,
        public readonly createLinkSession: CreateLinkSession | null,
        public readonly createTaskSession: CreateTaskSession | null,
    ) {}

    copy(props: Partial<typeof BoardState.ownProps>): BoardState {
        return Object.assign(Object.create(BoardState.prototype), this, props);
    }

    static empty() {
        return this.create({
            dragSession: null,
            moveTaskSession: null,
            createLinkSession: null,
            createTaskSession: null,
        });
    }

    static create(props: typeof this.ownProps) {
        return this.prototype.copy(props);
    }

    private static ownProps = { ...this.prototype };
}

export class BoardController extends ReactiveStateMachine<BoardState> {
    public readonly onPointerDown = new Channel<Point>();
    public readonly onPointerMove = new Channel<Point>();
    public readonly onPointerUp = new Channel<Point>();
    public readonly onTaskPointerEnter = new Channel<string>();
    public readonly onTaskPointerLeave = new Channel<string>();

    constructor(
        public readonly taskRepository: TaskRepository,
        public readonly linkRepository: LinkRepository,
    ) {
        super(BoardState.empty());
    }

    [Disposable.dispose]() {
        dispose(this.onPointerMove);
        dispose(this.onPointerUp);
        dispose(this.onTaskPointerEnter);
        dispose(this.onTaskPointerLeave);

        super[Disposable.dispose]();
    }

    startMoveTaskSession(taskId: string, point: Point) {
        const dragSession = new DragSession(this, point);
        const moveTaskSession = new MoveTaskSession(taskId, dragSession, this.taskRepository);

        dragSession.onEnd.addListener(this.handleDragSessionEnd);
        moveTaskSession.onEnd.addListener(this.handleMoveTaskSessionEnd);

        this.state = this.state.copy({ dragSession, moveTaskSession });
    }

    startCreateLinkSession(sourceTaskId: string, point: Point) {
        const dragSession = new DragSession(this, point);
        const createLinkSession = new CreateLinkSession(
            sourceTaskId,
            this,
            dragSession,
            this.taskRepository,
            this.linkRepository,
        );

        dragSession.onEnd.addListener(this.handleDragSessionEnd);
        createLinkSession.onEnd.addListener(this.handleCreateLinkSessionEnd);

        this.state = this.state.copy({ dragSession, createLinkSession });
    }

    startCreateTaskSession(point: Point) {
        const createTaskSession = new CreateTaskSession(point, this.taskRepository);

        createTaskSession.onEnd.addListener(this.handleCreateTaskSessionEnd);

        this.state = this.state.copy({ createTaskSession });
    }

    handlePointerDown(point: Point) {
        this.onPointerDown.fire(point);
    }

    handlePointerMove(point: Point) {
        this.onPointerMove.fire(point);
    }

    handlePointerUp(point: Point) {
        this.onPointerUp.fire(point);
    }

    handleTaskPointerEnter(taskId: string) {
        this.onTaskPointerEnter.fire(taskId);
    }

    handleTaskPointerLeave(taskId: string) {
        this.onTaskPointerLeave.fire(taskId);
    }

    private handleDragSessionEnd = () => {
        this.state = this.state.copy({ dragSession: null });
    };

    private handleMoveTaskSessionEnd = () => {
        this.state = this.state.copy({ moveTaskSession: null });
    };

    private handleCreateLinkSessionEnd = () => {
        this.state = this.state.copy({ createLinkSession: null });
    };

    private handleCreateTaskSessionEnd = () => {
        this.state = this.state.copy({ createTaskSession: null });
    };
}
