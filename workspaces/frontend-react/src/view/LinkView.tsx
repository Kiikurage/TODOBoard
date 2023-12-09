import { Link } from '../model/Link';

export function LinkView({ link }: { link: Link }) {
    return (
        <svg
            width={window.innerWidth}
            height={window.innerHeight}
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
