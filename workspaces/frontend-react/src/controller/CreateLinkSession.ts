import { BoardControllerEvents } from './BoardController';
import { DragSession, DragSessionState } from './DragSession';
import { Task } from '../model/Task';
import { assert } from '../lib/assert';
import { ch } from '../lib/channel/ch';
import { TaskRepository } from '../repository/TaskRepository';
import { CreateAndSaveNewLinkUseCase } from '../usecase/CreateAndSaveNewLinkUseCase';
import { AbstractSession } from './AbstractSession';
import { dispose, SymbolDispose } from '../lib/Disposable';

export class CreateLinkSessionState {
    constructor(
        public readonly currentX: number,
        public readonly currentY: number,
        public readonly sourceTaskId: string | null,
        public readonly sourceTask: Task | null,
        public readonly destinationTaskId: string | null,
        public readonly destinationTask: Task | null,
    ) {}

    static readonly EMPTY = CreateLinkSessionState.create({
        currentX: 0,
        currentY: 0,
        sourceTaskId: null,
        sourceTask: null,
        destinationTaskId: null,
        destinationTask: null,
    });

    get readyToSubmit() {
        if (this.sourceTask?.id === this.destinationTask?.id) return false;
        if (this.sourceTask === null || this.destinationTask === null) return false;

        return true;
    }

    isActiveTask(taskId: string): boolean {
        if (!this.readyToSubmit) return false;

        return this.sourceTask?.id === taskId || this.destinationTask?.id === taskId;
    }

    copy(props: Partial<typeof ownProps>): CreateLinkSessionState {
        return Object.assign(Object.create(CreateLinkSessionState.prototype), this, props);
    }

    static create(props: typeof ownProps): CreateLinkSessionState {
        return CreateLinkSessionState.prototype.copy(props);
    }
}

const ownProps = { ...CreateLinkSessionState.prototype };

export class CreateLinkSession extends AbstractSession {
    public readonly state = ch.data(CreateLinkSessionState.EMPTY);

    constructor(
        public readonly sourceTaskId: string,
        private readonly boardViewEvents: BoardControllerEvents,
        private readonly dragSession: DragSession,
        private readonly taskRepository: TaskRepository,
        private readonly createAndSaveNewLink: CreateAndSaveNewLinkUseCase,
    ) {
        super();

        this.state.set((oldState) =>
            oldState.copy({
                sourceTaskId: this.sourceTaskId,
                sourceTask: this.taskRepository.findById(this.sourceTaskId),
            }),
        );

        this.taskRepository.onChange.addListener(this.handleTaskRepositoryChange);
        this.boardViewEvents.onTaskPointerEnter.addListener(this.handleTaskPointerEnter);
        this.boardViewEvents.onTaskPointerLeave.addListener(this.handleTaskPointerLeave);
        this.dragSession.onDragMove.addListener(this.handleDragMove);
        this.dragSession.onDragEnd.addListener(this.handleDragEnd);
    }

    [SymbolDispose]() {
        super[SymbolDispose]();

        this.taskRepository.onChange.removeListener(this.handleTaskRepositoryChange);
        this.boardViewEvents.onTaskPointerEnter.removeListener(this.handleTaskPointerEnter);
        this.boardViewEvents.onTaskPointerLeave.removeListener(this.handleTaskPointerLeave);
        this.dragSession.onDragMove.removeListener(this.handleDragMove);
        this.dragSession.onDragEnd.removeListener(this.handleDragEnd);

        dispose(this.state);
    }

    private readonly handleTaskRepositoryChange = () => {
        this.state.set((oldState) =>
            oldState.copy({
                sourceTask: oldState.sourceTaskId === null ? null : this.taskRepository.findById(oldState.sourceTaskId),
                destinationTask:
                    oldState.destinationTaskId === null
                        ? null
                        : this.taskRepository.findById(oldState.destinationTaskId),
            }),
        );
    };

    private readonly handleTaskPointerEnter = ({ taskId }: { taskId: string }) => {
        this.state.set((oldState) =>
            oldState.copy({
                destinationTaskId: taskId,
                destinationTask: this.taskRepository.findById(taskId),
            }),
        );
    };

    private readonly handleTaskPointerLeave = () => {
        this.state.set((oldState) =>
            oldState.copy({
                destinationTaskId: null,
                destinationTask: null,
            }),
        );
    };

    private readonly handleDragMove = (state: DragSessionState) => {
        this.state.set((oldState) =>
            oldState.copy({
                currentX: state.currentPosition.x,
                currentY: state.currentPosition.y,
            }),
        );
    };

    private readonly handleDragEnd = () => {
        try {
            const { destinationTaskId, readyToSubmit } = this.state.get();
            if (!readyToSubmit) return;
            assert(destinationTaskId !== null, 'destinationTaskId !== null');

            this.createAndSaveNewLink(this.sourceTaskId, destinationTaskId);
        } finally {
            dispose(this);
        }
    };
}
