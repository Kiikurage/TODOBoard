import { DragState } from './hook/useDrag';
import { COLOR_ACTIVE } from './style/Colors';
import { CreateLinkSession } from './hook/useCreateLinkSession';
import { useFlow } from './hook/useFlow';

export function CreateLinkView({
    linkDraftSession,
    linkHandleDragState,
}: {
    linkDraftSession: CreateLinkSession;
    linkHandleDragState: DragState;
}) {
    const { isLinkDraftReady, destinationTask, sourceTask } = useFlow(linkDraftSession.detail);
    if (sourceTask === null) return null;

    const linkDraftX1 = sourceTask.x + sourceTask.width / 2;
    const linkDraftY1 = sourceTask.y + sourceTask.height / 2;
    const linkDraftX2 = destinationTask ? destinationTask.x + destinationTask.width / 2 : linkHandleDragState.currentX;
    const linkDraftY2 = destinationTask ? destinationTask.y + destinationTask.height / 2 : linkHandleDragState.currentY;

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
