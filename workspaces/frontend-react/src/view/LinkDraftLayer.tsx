import { DragState } from './hooks/useDrag';
import { COLOR_ACTIVE } from './styles/Colors';
import { Task } from '../model/Task';

export function LinkDraftLayer({
    linkHandleDragState,
    linkDraftSourceTask,
    linkDraftDestinationTask,
    isLinkDraftReady,
}: {
    linkHandleDragState: DragState;
    linkDraftSourceTask: Task | null;
    linkDraftDestinationTask: Task | null;
    isLinkDraftReady: boolean;
}) {
    if (linkDraftSourceTask === null) return null;

    const linkDraftX1 = linkDraftSourceTask.x + linkDraftSourceTask.width / 2;
    const linkDraftY1 = linkDraftSourceTask.y + linkDraftSourceTask.height / 2;
    const linkDraftX2 = linkDraftDestinationTask
        ? linkDraftDestinationTask.x + linkDraftDestinationTask.width / 2
        : linkHandleDragState.currentX;
    const linkDraftY2 = linkDraftDestinationTask
        ? linkDraftDestinationTask.y + linkDraftDestinationTask.height / 2
        : linkHandleDragState.currentY;

    return (
        <svg
            width={window.innerWidth}
            height={window.innerHeight}
            strokeWidth={2}
            strokeDasharray={isLinkDraftReady ? 'none' : '4 4'}
            stroke={isLinkDraftReady ? COLOR_ACTIVE : '#aaa'}
            css={{
                position: 'fixed',
                inset: 0,
                pointerEvents: 'none',
            }}
        >
            <line x1={linkDraftX1} y1={linkDraftY1} x2={linkDraftX2} y2={linkDraftY2} />
        </svg>
    );
}
