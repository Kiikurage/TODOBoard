import { COLOR_ACTIVE } from './style/Colors';
import { useDataChannel } from './hook/useDataChannel';
import { CreateLinkSession } from './model/CreateLinkSession';

export function CreateLinkSessionView({ createLinkSession }: { createLinkSession: CreateLinkSession }) {
    const { isLinkDraftReady, destinationTask, sourceTask, currentX, currentY } = useDataChannel(
        createLinkSession.state,
    );
    if (sourceTask === null) return null;

    const linkDraftX1 = sourceTask.x + sourceTask.width / 2;
    const linkDraftY1 = sourceTask.y + sourceTask.height / 2;
    const linkDraftX2 = destinationTask ? destinationTask.x + destinationTask.width / 2 : currentX;
    const linkDraftY2 = destinationTask ? destinationTask.y + destinationTask.height / 2 : currentY;

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
