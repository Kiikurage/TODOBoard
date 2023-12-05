import { singleton } from '../../lib/singleton';
import { RefObject, useLayoutEffect } from 'react';

class ResizeObserverWrapper {
    private readonly resizeObserver: ResizeObserver;
    private readonly callbacks = new Map<Element, (entry: ResizeObserverEntry) => void>();

    constructor() {
        this.resizeObserver = new ResizeObserver(this.handleResize);
    }

    private readonly handleResize = (entries: ResizeObserverEntry[]) => {
        entries.forEach((entry) => this.callbacks.get(entry.target)?.(entry));
    };

    observe(target: Element, callback: (entry: ResizeObserverEntry) => void) {
        this.callbacks.set(target, callback);
        this.resizeObserver.observe(target);
    }

    unobserve(target: Element) {
        this.resizeObserver.unobserve(target);
        this.callbacks.delete(target);
    }
}

const getInstance = singleton(() => new ResizeObserverWrapper());

export function useResizeObserver(ref: RefObject<Element>, callback: (entry: ResizeObserverEntry) => void) {
    const target = ref.current;

    useLayoutEffect(() => {
        if (target === null) return;

        const resizeObserver = getInstance();

        resizeObserver.observe(target, callback);
        return () => resizeObserver.unobserve(target);
    }, [callback, target]);
}
