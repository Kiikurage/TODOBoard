import { useEffect, useRef } from 'react';
import { Vector2 } from '../lib/geometry/Vector2';
import { useResizeObserver } from './hook/useResizeObserver';
import { BoardViewController } from './controller/BoardViewController';
import { DebugView } from './DebugView';

export function BoardView({ controller }: { controller: BoardViewController }) {
    useEffect(() => {
        window.addEventListener('pointermove', controller.handlePointerMove);
        window.addEventListener('pointerup', controller.handlePointerUp);
        return () => {
            window.removeEventListener('pointermove', controller.handlePointerMove);
            window.removeEventListener('pointerup', controller.handlePointerUp);
        };
    }, [controller.handlePointerMove, controller.handlePointerUp]);

    const ref = useRef<HTMLDivElement | null>(null);
    useResizeObserver(ref, (entry) => {
        controller.setDisplaySize(
            new Vector2({
                x: entry.contentRect.width,
                y: entry.contentRect.height,
            }),
        );
    });

    return (
        <div
            ref={ref}
            css={{
                position: 'absolute',
                inset: 0,
                userSelect: 'none',
                background: '#f8faff',
            }}
            onPointerDown={(ev) => {
                controller.handlePointerDown(ev.nativeEvent);
                window.getSelection()?.removeAllRanges?.();
            }}
        >
            <div
                css={{
                    position: 'absolute',
                    inset: 0,
                }}
            ></div>

            <DebugView controller={controller} />
        </div>
    );
}
