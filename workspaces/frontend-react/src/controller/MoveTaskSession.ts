import { DragSession, DragSessionState } from './DragSession';
import { Disposable, dispose } from '../lib/Disposable';
import { TaskRepository } from '../model/repository/TaskRepository';
import { Point } from '../lib/geometry/Point';
import { throwError } from '../lib/throwError';
import { AbstractSession } from './AbstractSession';

export class MoveTaskSession extends AbstractSession<DragSessionState> {
    private readonly originalPosition: Point;

    constructor(
        private readonly taskId: string,
        private readonly dragSession: DragSession,
        private readonly taskRepository: TaskRepository,
    ) {
        super(dragSession.state);

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
        this.state = state;

        const task = this.taskRepository.findById(this.taskId);
        if (task === null) return;

        this.taskRepository.update(task.id, {
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
