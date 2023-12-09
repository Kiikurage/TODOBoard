import { DragSession, DragSessionState } from './DragSession';
import { Disposable, dispose } from '../../lib/Disposable';
import { Point } from '../../lib/geometry/Point';
import { AbstractSession } from '../../controller/AbstractSession';
import { BoardViewController } from './BoardViewController';

export class MoveViewportSession extends AbstractSession<void> {
    constructor(
        public readonly originalPosition: Point,
        private readonly dragSession: DragSession,
        private readonly boardViewController: BoardViewController,
    ) {
        super();

        this.dragSession.onDragMove.addListener(this.handleDragMove);
        this.dragSession.onDragEnd.addListener(this.handleDragEnd);
    }

    [Disposable.dispose]() {
        this.dragSession.onDragMove.removeListener(this.handleDragMove);
        this.dragSession.onDragEnd.removeListener(this.handleDragEnd);
    }

    private handleDragMove = (state: DragSessionState) => {
        const { diff } = state;

        this.boardViewController.setViewportPosition(
            this.originalPosition.x - diff.x,
            this.originalPosition.y - diff.y,
        );
    };

    private handleDragEnd = () => {
        dispose(this);
    };
}
