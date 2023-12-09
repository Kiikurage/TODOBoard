import { Link } from '../model/Link';
import { BoardViewState } from './controller/BoardViewController';

export function LinkView({ link, boardViewState }: { link: Link; boardViewState: BoardViewState }) {
    return (
        <svg
            width={boardViewState.viewportRect.width}
            height={boardViewState.viewportRect.height}
            viewBox={`${boardViewState.viewportRect.left} ${boardViewState.viewportRect.top} ${boardViewState.viewportRect.width} ${boardViewState.viewportRect.height}`}
            stroke="#bbb"
            strokeWidth={2}
            css={{
                position: 'fixed',
                inset: 0,
                pointerEvents: 'none',
            }}
        >
            <line
                x1={link.sourceTask.rect.center.x}
                y1={link.sourceTask.rect.center.y}
                x2={link.destinationTask.rect.center.x}
                y2={link.destinationTask.rect.center.y}
            />
        </svg>
    );
}
