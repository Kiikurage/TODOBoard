import { DragSession, DragSessionState } from '../../controller/DragSession';
import { Disposable, dispose } from '../../lib/Disposable';
import { Point } from '../../lib/geometry/Point';
import { AbstractSession } from '../../controller/AbstractSession';
import { BoardViewController } from './BoardViewController';
import { Camera } from '../model/Camera';

export class MoveViewportSession extends AbstractSession<void> {
    constructor(
        public readonly originalCamera: Camera,
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
            Point.create({
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
