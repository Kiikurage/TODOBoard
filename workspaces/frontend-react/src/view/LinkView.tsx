import { Link } from '../model/Link';
import { BoardViewState } from './controller/BoardViewController';

export function LinkView({ link, boardViewState }: { link: Link; boardViewState: BoardViewState }) {
    return (
        <svg
            width={boardViewState.rect.width}
            height={boardViewState.rect.height}
            viewBox={`${boardViewState.rect.left} ${boardViewState.rect.top} ${boardViewState.rect.width} ${boardViewState.rect.height}`}
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
