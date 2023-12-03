import { MouseEventHandler, useCallback, useEffect, useState } from 'react';

export interface DragState {
    isDragging: boolean;
    startX: number;
    startY: number;
    currentX: number;
    currentY: number;
}

export function useDrag({
    onDragStart,
    onDragMove,
    onDragEnd,
}: {
    onDragStart?: (dragState: DragState) => void;
    onDragMove?: (dragState: DragState) => void;
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
            onDragMove?.({
                ...dragState,
                currentX: ev.clientX,
                currentY: ev.clientY,
            });
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
    }, [dragState, dragState.isDragging, onDragEnd, onDragMove]);

    const handleDragHandleMouseDown: MouseEventHandler<HTMLDivElement> = useCallback(
        (ev) => {
            ev.preventDefault();

            const dragState = {
                isDragging: true,
                startX: ev.clientX,
                startY: ev.clientY,
                currentX: ev.clientX,
                currentY: ev.clientY,
            };

            onDragStart?.(dragState);
            setDragState(dragState);
        },
        [onDragStart],
    );

    return handleDragHandleMouseDown;
}
