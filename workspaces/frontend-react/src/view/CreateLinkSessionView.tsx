import { COLOR_ACTIVE } from './style/Colors';
import { useDataChannel } from './hook/useDataChannel';
import { CreateLinkSession } from './model/CreateLinkSession';
import { getIntersectionPointForLineSegmentAndRect } from '../lib/geometry/Line';
import { Point } from '../lib/geometry/Point';
import { Rect } from '../lib/geometry/Rect';
import { LineSegment } from '../lib/geometry/LineSegment';

export function CreateLinkSessionView({ createLinkSession }: { createLinkSession: CreateLinkSession }) {
    const { isLinkDraftReady, destinationTask, sourceTask, currentX, currentY } = useDataChannel(
        createLinkSession.state,
    );
    if (sourceTask === null) return null;

    const linkDraftX1 = sourceTask.x + sourceTask.width / 2;
    const linkDraftY1 = sourceTask.y + sourceTask.height / 2;
    const linkDraftX2 = destinationTask ? destinationTask.x + destinationTask.width / 2 : currentX;
    const linkDraftY2 = destinationTask ? destinationTask.y + destinationTask.height / 2 : currentY;

    const point1 = getIntersectionPointForLineSegmentAndRect(
        LineSegment.create({
            p1: Point.create({ x: linkDraftX1, y: linkDraftY1 }),
            p2: Point.create({ x: linkDraftX2, y: linkDraftY2 }),
        }),
        Rect.create({ top: sourceTask.y, left: sourceTask.x, width: sourceTask.width, height: sourceTask.height }),
    );
    const point2 = destinationTask
        ? getIntersectionPointForLineSegmentAndRect(
              LineSegment.create({
                  p1: Point.create({ x: linkDraftX1, y: linkDraftY1 }),
                  p2: Point.create({ x: linkDraftX2, y: linkDraftY2 }),
              }),
              Rect.create({
                  top: destinationTask.y,
                  left: destinationTask.x,
                  width: destinationTask.width,
                  height: destinationTask.height,
              }),
          )
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
                x1={point1?.x ?? linkDraftX1}
                y1={point1?.y ?? linkDraftY1}
                x2={point2?.x ?? linkDraftX2}
                y2={point2?.y ?? linkDraftY2}
            />
        </svg>
    );
}
