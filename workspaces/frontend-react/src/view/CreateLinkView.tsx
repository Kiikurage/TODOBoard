import { getIntersectionPointForLineSegmentAndRect } from '../lib/geometry/Line';
import { Point } from '../lib/geometry/Point';
import { LineSegment } from '../lib/geometry/LineSegment';
import { CreateLinkSession } from '../controller/CreateLinkSession';
import { COLOR_ACTIVE } from './style/colors';
import { useReactive } from './hook/useReactive';
import { isNotNullish } from '../lib/isNotNullish';
import { STYLE_CARD__ACTIVE_BORDERED } from './style/card';
import { BoardViewState } from './controller/BoardViewController';

export function CreateLinkView({
    createLinkSession,
    boardViewState,
}: {
    createLinkSession: CreateLinkSession;
    boardViewState: BoardViewState;
}) {
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
        <>
            {isNotNullish(sourceTask) && readyToSubmit && (
                <div
                    css={{
                        ...STYLE_CARD__ACTIVE_BORDERED,
                        pointerEvents: 'none',
                        position: 'absolute',
                        background: 'none',
                        top: sourceTask.rect.top - boardViewState.viewportRect.top,
                        left: sourceTask.rect.left - boardViewState.viewportRect.left,
                        width: sourceTask.rect.width,
                        height: sourceTask.rect.height,
                    }}
                />
            )}
            {isNotNullish(destinationTask) && readyToSubmit && (
                <div
                    css={{
                        ...STYLE_CARD__ACTIVE_BORDERED,
                        pointerEvents: 'none',
                        position: 'absolute',
                        background: 'none',
                        top: destinationTask.rect.top - boardViewState.viewportRect.top,
                        left: destinationTask.rect.left - boardViewState.viewportRect.left,
                        width: destinationTask.rect.width,
                        height: destinationTask.rect.height,
                    }}
                />
            )}
            <svg
                viewBox={`0 0 ${boardViewState.viewportRect.width} ${boardViewState.viewportRect.height}`}
                width={boardViewState.viewportRect.width}
                height={boardViewState.viewportRect.height}
                css={{
                    position: 'fixed',
                    inset: 0,
                    pointerEvents: 'none',
                }}
            >
                <defs>
                    <mask id="mask">
                        <rect x={0} y={0} width="100%" height="100%" fill="white" strokeWidth={0} />
                        {isNotNullish(sourceTask) && (
                            <rect
                                x={sourceTask.rect.left - boardViewState.viewportRect.left}
                                y={sourceTask.rect.top - boardViewState.viewportRect.top}
                                width={sourceTask.rect.width}
                                height={sourceTask.rect.height}
                                fill="black"
                                strokeWidth={0}
                            />
                        )}
                        {isNotNullish(destinationTask) && (
                            <rect
                                x={destinationTask.rect.left - boardViewState.viewportRect.left}
                                y={destinationTask.rect.top - boardViewState.viewportRect.top}
                                width={destinationTask.rect.width}
                                height={destinationTask.rect.height}
                                fill="black"
                                strokeWidth={0}
                            />
                        )}
                    </mask>
                </defs>
                <line
                    x1={point1.x - boardViewState.viewportRect.left}
                    y1={point1.y - boardViewState.viewportRect.top}
                    x2={(point2?.x ?? linkDraftP2.x) - boardViewState.viewportRect.left}
                    y2={(point2?.y ?? linkDraftP2.y) - boardViewState.viewportRect.top}
                    strokeWidth={2}
                    strokeDasharray={readyToSubmit ? 'none' : '4 4'}
                    stroke={readyToSubmit ? COLOR_ACTIVE : '#bbb'}
                    strokeLinecap="square"
                    mask="url(#mask)"
                />
            </svg>
        </>
    );
}
