import { BoardControllerEvents } from './BoardController';
import { DragSession, DragSessionState } from './DragSession';
import { Task } from '../model/Task';
import { assert } from '../lib/assert';
import { TaskRepository } from '../model/repository/TaskRepository';
import { AbstractSession } from './AbstractSession';
import { Disposable, dispose } from '../lib/Disposable';
import { LinkStorage } from '../model/storage/LinkStorage';

export class CreateLinkSessionState {
    constructor(
        public readonly currentX: number,
        public readonly currentY: number,
        public readonly sourceTaskId: string | null,
        public readonly sourceTask: Task | null,
        public readonly destinationTaskId: string | null,
        public readonly destinationTask: Task | null,
    ) {}

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

export class CreateLinkSession extends AbstractSession<CreateLinkSessionState> {
    constructor(
        public readonly sourceTaskId: string,
        private readonly boardControllerEvents: BoardControllerEvents,
        private readonly dragSession: DragSession,
        private readonly taskRepository: TaskRepository,
        private readonly linkStorage: LinkStorage,
    ) {
        super(
            CreateLinkSessionState.create({
                currentX: dragSession.state.currentPosition.x,
                currentY: dragSession.state.currentPosition.y,
                sourceTaskId: sourceTaskId,
                sourceTask: taskRepository.findById(sourceTaskId),
                destinationTaskId: null,
                destinationTask: null,
            }),
        );

        this.taskRepository.onChange.addListener(this.handleTaskRepositoryChange);
        this.boardControllerEvents.onTaskPointerEnter.addListener(this.handleTaskPointerEnter);
        this.boardControllerEvents.onTaskPointerLeave.addListener(this.handleTaskPointerLeave);
        this.dragSession.onDragMove.addListener(this.handleDragMove);
        this.dragSession.onDragEnd.addListener(this.handleDragEnd);
    }

    [Disposable.dispose]() {
        this.taskRepository.onChange.removeListener(this.handleTaskRepositoryChange);
        this.boardControllerEvents.onTaskPointerEnter.removeListener(this.handleTaskPointerEnter);
        this.boardControllerEvents.onTaskPointerLeave.removeListener(this.handleTaskPointerLeave);
        this.dragSession.onDragMove.removeListener(this.handleDragMove);
        this.dragSession.onDragEnd.removeListener(this.handleDragEnd);

        super[Disposable.dispose]();
    }

    private readonly handleTaskRepositoryChange = () => {
        this.state = this.state.copy({
            sourceTask: this.state.sourceTaskId === null ? null : this.taskRepository.findById(this.state.sourceTaskId),
            destinationTask:
                this.state.destinationTaskId === null
                    ? null
                    : this.taskRepository.findById(this.state.destinationTaskId),
        });
    };

    private readonly handleTaskPointerEnter = ({ taskId }: { taskId: string }) => {
        this.state = this.state.copy({
            destinationTaskId: taskId,
            destinationTask: this.taskRepository.findById(taskId),
        });
    };

    private readonly handleTaskPointerLeave = () => {
        this.state = this.state.copy({
            destinationTaskId: null,
            destinationTask: null,
        });
    };

    private readonly handleDragMove = (state: DragSessionState) => {
        this.state = this.state.copy({
            currentX: state.currentPosition.x,
            currentY: state.currentPosition.y,
        });
    };

    private readonly handleDragEnd = () => {
        try {
            const { destinationTaskId, readyToSubmit } = this.state;
            if (!readyToSubmit) return;
            assert(destinationTaskId !== null, 'destinationTaskId !== null');

            this.linkStorage.createAndSave({ sourceTaskId: this.sourceTaskId, destinationTaskId });
        } finally {
            dispose(this);
        }
    };
}
