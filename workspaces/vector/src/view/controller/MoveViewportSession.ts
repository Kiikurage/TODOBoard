import { DragSession, DragSessionState } from '../../controller/DragSession';
import { Disposable, dispose } from '../../lib/Disposable';
import { Vector2 } from '../../lib/geometry/Vector2';
import { Session } from '../../controller/Session';
import { BoardViewController } from './BoardViewController';

export class MoveViewportSession extends Session<void> {
    constructor(
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
        // position in viewport space is constant during drag.
        //
        // viewport = display0/scale0+origin0 = display1/scale1+origin1
        //
        // origin1 = origin0 - (display1/scale1 - display0/scale0)
        //         = origin0 - (size1 - size0)

        this.boardViewController.setCameraOrigin(
            new Vector2({
                x:
                    state.startCamera.origin.x -
                    (state.currentCamera.toViewportSize(state.currentDisplayPosition).x -
                        state.startCamera.toViewportSize(state.startDisplayPosition).x),
                y:
                    state.startCamera.origin.y -
                    (state.currentCamera.toViewportSize(state.currentDisplayPosition).y -
                        state.startCamera.toViewportSize(state.startDisplayPosition).y),
            }),
        );
    };

    private handleDragEnd = () => {
        dispose(this);
    };
}
