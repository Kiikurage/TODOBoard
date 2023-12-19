import { BoardViewController } from './controller/BoardViewController';
import { useReactive } from './hook/useReactive';
import { useEffect, useRef } from 'react';

export function DebugView({ controller }: { controller: BoardViewController }) {
    const boardViewState = useReactive(controller, (controller) => controller.state);
    const fps = useFPS();

    return (
        <div
            css={{
                pointerEvents: 'none',
                fontFamily: 'monospace',
                left: 10,
                bottom: 10,
                position: 'absolute',
                zIndex: 999999999999,
            }}
        >
            <div>
                Render: {new Date().toISOString()}, {fps}fps
            </div>
            <div>viewport: {`${boardViewState.rect}`}</div>
        </div>
    );
}

function useFPS() {
    const SAMPLING_SIZE = 1000; // 3sec

    const ts = useRef<number[]>([]).current;

    useEffect(() => {
        let timerId = requestAnimationFrame(function tick() {
            const now = performance.now();
            ts.push(now);

            while (ts.length > 0 && ts[0] < now - SAMPLING_SIZE) ts.shift();

            timerId = requestAnimationFrame(tick);
        });

        return () => cancelAnimationFrame(timerId);
    }, [ts]);

    return Math.round((ts.length / SAMPLING_SIZE) * 1000);
}
