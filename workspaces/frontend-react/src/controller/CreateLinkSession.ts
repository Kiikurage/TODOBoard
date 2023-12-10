import { DragSession, DragSessionState } from './DragSession';
import { Task } from '../model/Task';
import { assert } from '../lib/assert';
import { TaskRepository } from '../model/repository/TaskRepository';
import { AbstractSession } from './AbstractSession';
import { Disposable, dispose } from '../lib/Disposable';
import { LinkRepository } from '../model/repository/LinkRepository';
import { BoardController } from './BoardController';

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

    copy(props: Partial<typeof CreateLinkSessionState.ownProps>): CreateLinkSessionState {
        return Object.assign(Object.create(CreateLinkSessionState.prototype), this, props);
    }

    static create(props: typeof this.ownProps) {
        return this.prototype.copy(props);
    }

    private static readonly ownProps = { ...this.prototype };
}

export class CreateLinkSession extends AbstractSession<CreateLinkSessionState> {
    constructor(
        public readonly sourceTaskId: string,
        private readonly boardController: BoardController,
        private readonly dragSession: DragSession,
        private readonly taskRepository: TaskRepository,
        private readonly linkRepository: LinkRepository,
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
        this.boardController.onTaskPointerEnter.addListener(this.handleTaskPointerEnter);
        this.boardController.onTaskPointerLeave.addListener(this.handleTaskPointerLeave);
        this.dragSession.onDragMove.addListener(this.handleDragMove);
        this.dragSession.onDragEnd.addListener(this.handleDragEnd);
    }

    [Disposable.dispose]() {
        this.taskRepository.onChange.removeListener(this.handleTaskRepositoryChange);
        this.boardController.onTaskPointerEnter.removeListener(this.handleTaskPointerEnter);
        this.boardController.onTaskPointerLeave.removeListener(this.handleTaskPointerLeave);
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

    private readonly handleTaskPointerEnter = (taskId: string) => {
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

            this.linkRepository.createAndSave({ sourceTaskId: this.sourceTaskId, destinationTaskId });
        } finally {
            dispose(this);
        }
    };
}
