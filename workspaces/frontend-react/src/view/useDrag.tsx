import { MouseEventHandler, useCallback, useEffect, useState } from 'react';

export interface DragState {
    isDragging: boolean;
    startX: number;
    startY: number;
    currentX: number;
    currentY: number;
}

export function useDrag({
    onDragEnd,
}: {
    onDragEnd?: (dragState: DragState) => void;
} = {}) {
    const [dragState, setDragState] = useState<DragState>({
        isDragging: false,
        startX: 0,
        startY: 0,
        currentX: 0,
        currentY: 0,
    });

    useEffect(() => {
        function handleWindowMouseMove(ev: MouseEvent) {
            if (!dragState.isDragging) return;
            setDragState((oldState) => {
                return {
                    ...oldState,
                    currentX: ev.clientX,
                    currentY: ev.clientY,
                };
            });
        }

        function handleWindowMouseUp() {
            if (!dragState.isDragging) return;
            onDragEnd?.(dragState);
            setDragState({
                isDragging: false,
                startX: 0,
                startY: 0,
                currentX: 0,
                currentY: 0,
            });
        }

        window.addEventListener('mousemove', handleWindowMouseMove);
        window.addEventListener('mouseup', handleWindowMouseUp);
        return () => {
            window.removeEventListener('mousemove', handleWindowMouseMove);
            window.removeEventListener('mouseup', handleWindowMouseUp);
        };
    }, [dragState, dragState.isDragging, onDragEnd]);

    const handleDragHandleMouseDown: MouseEventHandler<HTMLDivElement> = useCallback((ev) => {
        setDragState({
            isDragging: true,
            startX: ev.clientX,
            startY: ev.clientY,
            currentX: ev.clientX,
            currentY: ev.clientY,
        });
    }, []);

    return [dragState, handleDragHandleMouseDown] as const;
}
