import { Channel } from '../lib/Channel';
import { Point } from '../lib/geometry/Point';
import { DragSession } from './DragSession';
import { CreateLinkSession } from './CreateLinkSession';
import { MoveTaskSession } from './MoveTaskSession';
import { CreateTaskSession } from './CreateTaskSession';
import { TaskRepository, UpdateTaskProps } from '../model/repository/TaskRepository';
import { LinkRepository } from '../model/repository/LinkRepository';
import { BoardEvents } from './BoardEvents';
import { ReactiveStateMachine } from '../lib/ReactiveStateMachine';
import { Disposable, dispose } from '../lib/Disposable';

export class BoardControllerState {
    constructor(
        public readonly dragSessions: DragSession[],
        public readonly moveTaskSessions: MoveTaskSession[],
        public readonly createLinkSessions: CreateLinkSession[],
        public readonly createTaskSession: CreateTaskSession | null,
    ) {}

    copy(props: Partial<typeof ownProps>): BoardControllerState {
        return Object.assign(Object.create(BoardControllerState.prototype), this, props);
    }

    static empty() {
        return BoardControllerState.create({
            dragSessions: [],
            moveTaskSessions: [],
            createLinkSessions: [],
            createTaskSession: null,
        });
    }

    static create(props: typeof ownProps): BoardControllerState {
        return BoardControllerState.prototype.copy(props);
    }
}

const ownProps = { ...BoardControllerState.prototype };

export class BoardController extends ReactiveStateMachine<BoardControllerState> implements BoardEvents {
    public readonly onPointerDown = new Channel<Point>();
    public readonly onPointerMove = new Channel<Point>();
    public readonly onPointerUp = new Channel<Point>();
    public readonly onDragStart = new Channel<DragSession>();
    public readonly onTaskPointerEnter = new Channel<{ taskId: string; point: Point }>();
    public readonly onTaskPointerLeave = new Channel<{ taskId: string; point: Point }>();

    constructor(
        public readonly taskRepository: TaskRepository,
        public readonly linkRepository: LinkRepository,
    ) {
        super(BoardControllerState.empty());
    }

    [Disposable.dispose]() {
        dispose(this.onPointerDown);
        dispose(this.onPointerMove);
        dispose(this.onPointerUp);
        dispose(this.onDragStart);
        dispose(this.onTaskPointerEnter);
        dispose(this.onTaskPointerLeave);

        super[Disposable.dispose]();
    }

    handleTaskUpdate(taskId: string, props: UpdateTaskProps) {
        this.taskRepository.update(taskId, props);
    }

    handleTaskDragStart(taskId: string, point: Point) {
        const dragSession = new DragSession(this, point);
        const moveTaskSession = new MoveTaskSession(taskId, dragSession, this.taskRepository);

        dragSession.onEnd.addListener(() => this.handleDragSessionEnd(dragSession));
        moveTaskSession.onEnd.addListener(() => this.handleMoveTaskSessionEnd(moveTaskSession));

        this.state = this.state.copy({
            dragSessions: [...this.state.dragSessions, dragSession],
            moveTaskSessions: [...this.state.moveTaskSessions, moveTaskSession],
        });
    }

    handleCreateLinkStart(sourceTaskId: string, point: Point) {
        const dragSession = new DragSession(this, point);
        const createLinkSession = new CreateLinkSession(
            sourceTaskId,
            this,
            dragSession,
            this.taskRepository,
            this.linkRepository,
        );

        dragSession.onEnd.addListener(() => this.handleDragSessionEnd(dragSession));
        createLinkSession.onEnd.addListener(() => this.handleCreateLinkSessionEnd(createLinkSession));

        this.state = this.state.copy({
            dragSessions: [...this.state.dragSessions, dragSession],
            createLinkSessions: [...this.state.createLinkSessions, createLinkSession],
        });
    }

    handleDoubleClick(point: Point) {
        const createTaskSession = new CreateTaskSession(point, this.taskRepository);

        createTaskSession.onEnd.addListener(() => this.handleCreateTaskSessionEnd(createTaskSession));

        this.state = this.state.copy({
            createTaskSession,
        });
    }

    handlePointerDown(point: Point) {
        this.onPointerDown.fire(point);
        this.onDragStart.fire(new DragSession(this, point));
    }

    handlePointerMove(point: Point) {
        this.onPointerMove.fire(point);
    }

    handlePointerUp(point: Point) {
        this.onPointerUp.fire(point);
    }

    handleTaskPointerEnter(taskId: string, point: Point) {
        this.onTaskPointerEnter.fire({ taskId, point });
    }

    handleTaskPointerLeave(taskId: string, point: Point) {
        this.onTaskPointerLeave.fire({ taskId, point });
    }

    private handleDragSessionEnd(session: DragSession) {
        this.state = this.state.copy({
            dragSessions: this.state.dragSessions.filter((s) => s !== session),
        });
    }

    private handleMoveTaskSessionEnd(session: MoveTaskSession) {
        this.state = this.state.copy({
            moveTaskSessions: this.state.moveTaskSessions.filter((s) => s !== session),
        });
    }

    private handleCreateLinkSessionEnd(session: CreateLinkSession) {
        this.state = this.state.copy({
            createLinkSessions: this.state.createLinkSessions.filter((s) => s !== session),
        });
    }

    private handleCreateTaskSessionEnd(session: CreateTaskSession) {
        this.state = this.state.copy({
            createTaskSession: this.state.createTaskSession === session ? null : this.state.createTaskSession,
        });
    }
}
