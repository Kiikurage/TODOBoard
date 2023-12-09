import { DragSession, DragSessionState } from './DragSession';
import { Disposable, dispose } from '../lib/Disposable';
import { TaskRepository } from '../repository/TaskRepository';
import { Point } from '../lib/geometry/Point';
import { throwError } from '../lib/throwError';
import { UpdateTaskUseCase } from '../usecase/UpdateTaskUseCase';
import { AbstractSession } from './AbstractSession';

export class MoveTaskSession extends AbstractSession {
    private readonly originalPosition: Point;

    constructor(
        private readonly taskId: string,
        private readonly dragSession: DragSession,
        private readonly taskRepository: TaskRepository,
        private readonly updateTask: UpdateTaskUseCase,
    ) {
        super();

        this.dragSession.onDragMove.addListener(this.handleDragMove);
        this.dragSession.onDragEnd.addListener(this.handleDragEnd);

        const task = this.taskRepository.findById(this.taskId) ?? throwError('Task not found');

        this.originalPosition = task.rect.p1;
    }

    [Disposable.dispose]() {
        this.dragSession.onDragMove.removeListener(this.handleDragMove);
        this.dragSession.onDragEnd.removeListener(this.handleDragEnd);
    }

    private handleDragMove = (state: DragSessionState) => {
        const task = this.taskRepository.findById(this.taskId);
        if (task === undefined) return;

        this.updateTask(task.id, {
            rect: task.rect.copy({
                left: this.originalPosition.x + state.diff.x,
                top: this.originalPosition.y + state.diff.y,
            }),
        });
    };

    private handleDragEnd = () => {
        dispose(this);
    };
}
