import { COLOR_ACTIVE } from './style/Colors';
import { useDataChannel } from './hook/useDataChannel';
import { CreateLinkSession } from './model/CreateLinkSession';
import { getPathPoints } from '../lib/Line';
import { Point } from '../lib/Point';

export function CreateLinkSessionView({ createLinkSession }: { createLinkSession: CreateLinkSession }) {
    const { isLinkDraftReady, destinationTask, sourceTask, currentX, currentY } = useDataChannel(
        createLinkSession.state,
    );
    if (sourceTask === null) return null;

    const linkDraftX1 = sourceTask.x + sourceTask.width / 2;
    const linkDraftY1 = sourceTask.y + sourceTask.height / 2;
    const linkDraftX2 = destinationTask ? destinationTask.x + destinationTask.width / 2 : currentX;
    const linkDraftY2 = destinationTask ? destinationTask.y + destinationTask.height / 2 : currentY;

    const point1 = getPathPoints(Point(linkDraftX1, linkDraftY1), Point(linkDraftX2, linkDraftY2), sourceTask);
    const point2 = destinationTask
        ? getPathPoints(Point(linkDraftX1, linkDraftY1), Point(linkDraftX2, linkDraftY2), destinationTask)
        : null;

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
            <line
                x1={point1?.[0] ?? linkDraftX1}
                y1={point1?.[1] ?? linkDraftY1}
                x2={point2?.[0] ?? linkDraftX2}
                y2={point2?.[1] ?? linkDraftY2}
            />
        </svg>
    );
}
