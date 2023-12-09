import { getIntersectionPointForLineSegmentAndRect } from '../lib/geometry/Line';
import { Point } from '../lib/geometry/Point';
import { LineSegment } from '../lib/geometry/LineSegment';
import { CreateLinkSession } from '../controller/CreateLinkSession';
import { COLOR_ACTIVE } from './style/colors';
import { useReactive } from './hook/useReactive';

export function CreateLinkView({ createLinkSession }: { createLinkSession: CreateLinkSession }) {
    const { readyToSubmit, destinationTask, sourceTask, currentX, currentY } = useReactive(
        createLinkSession,
        (session) => session.state,
    );
    if (sourceTask === null) return null;

    const linkDraftP1 = sourceTask.rect.center;
    const linkDraftP2 = destinationTask ? destinationTask.rect.center : Point.create({ x: currentX, y: currentY });

    const point1 =
        getIntersectionPointForLineSegmentAndRect(
            LineSegment.create({ p1: linkDraftP1, p2: linkDraftP2 }),
            sourceTask.rect,
        )[0] ?? null;
    const point2 = destinationTask
        ? getIntersectionPointForLineSegmentAndRect(
              LineSegment.create({ p1: linkDraftP1, p2: linkDraftP2 }),
              destinationTask.rect,
          )[0] ?? null
        : null;

    if (point1 === null) return null;

    return (
        <svg
            width={window.innerWidth}
            height={window.innerHeight}
            strokeWidth={2}
            strokeDasharray={readyToSubmit ? 'none' : '4 4'}
            stroke={readyToSubmit ? COLOR_ACTIVE : '#bbb'}
            css={{
                position: 'fixed',
                inset: 0,
                pointerEvents: 'none',
            }}
        >
            <line x1={point1.x} y1={point1.y} x2={point2?.x ?? linkDraftP2.x} y2={point2?.y ?? linkDraftP2.y} />
        </svg>
    );
}
