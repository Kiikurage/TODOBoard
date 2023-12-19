import { Channel } from '../lib/Channel';
import { Vector2 } from '../lib/geometry/Vector2';
import { CreateLinkSession } from './CreateLinkSession';
import { MoveTaskSession } from './MoveTaskSession';
import { CreateTaskSession } from './CreateTaskSession';
import { TaskRepository } from '../model/repository/TaskRepository';
import { LinkRepository } from '../model/repository/LinkRepository';
import { ReactiveStateMachine } from '../lib/ReactiveStateMachine';
import { Disposable, dispose } from '../lib/Disposable';
import { DragSession } from './DragSession';

export class BoardState {
    constructor(
        public readonly createTaskSession: CreateTaskSession | null,
        public readonly createLinkSession: CreateLinkSession | null,
        public readonly moveTaskSession: MoveTaskSession | null,
        public readonly selectedTaskId: string | null = null,
    ) {}

    copy(props: Partial<typeof BoardState.ownProps>): BoardState {
        return Object.assign(Object.create(BoardState.prototype), this, props);
    }

    static readonly EMPTY = this.create({
        createLinkSession: null,
        moveTaskSession: null,
        createTaskSession: null,
        selectedTaskId: null,
    });

    static create(props: typeof this.ownProps) {
        return this.prototype.copy(props);
    }

    private static ownProps = { ...this.prototype };
}

export class BoardController extends ReactiveStateMachine<BoardState> {
    public readonly onTaskPointerEnter = new Channel<string>();
    public readonly onTaskPointerLeave = new Channel<string>();

    constructor(
        public readonly taskRepository: TaskRepository,
        public readonly linkRepository: LinkRepository,
    ) {
        super(BoardState.EMPTY);
    }

    [Disposable.dispose]() {
        dispose(this.onTaskPointerEnter);
        dispose(this.onTaskPointerLeave);

        super[Disposable.dispose]();
    }

    get selectedTask() {
        if (this.state.selectedTaskId === null) return null;

        return this.taskRepository.findById(this.state.selectedTaskId);
    }

    startMoveTaskSession(taskId: string, dragSession: DragSession) {
        const session = new MoveTaskSession(taskId, dragSession, this.taskRepository);

        this.state = this.state.copy({ moveTaskSession: session });

        session.onEnd.addListener(() => {
            this.state = this.state.copy({ moveTaskSession: null });
        });

        return session;
    }

    startCreateLinkSession(sourceTaskId: string, dragSession: DragSession) {
        const session = new CreateLinkSession(
            sourceTaskId,
            this,
            dragSession,
            this.taskRepository,
            this.linkRepository,
        );

        this.state = this.state.copy({ createLinkSession: session });

        session.onEnd.addListener(() => {
            this.state = this.state.copy({ createLinkSession: null });
        });

        return session;
    }

    startCreateTaskSession(point: Vector2) {
        const session = new CreateTaskSession(point, this.taskRepository);

        this.state = this.state.copy({ createTaskSession: session });

        session.onEnd.addListener(() => {
            this.state = this.state.copy({ createTaskSession: null });
        });

        return session;
    }

    readonly handleTaskPointerEnter = (taskId: string) => {
        this.onTaskPointerEnter.fire(taskId);
    };

    readonly handleTaskPointerLeave = (taskId: string) => {
        this.onTaskPointerLeave.fire(taskId);
    };
}
