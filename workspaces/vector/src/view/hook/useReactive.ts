import { useEffect, useState } from 'react';
import { Reactive } from '../../lib/Reactive';

export function useReactive<T extends Reactive, U>(reactive: T, map: (reactive: T) => U): U {
    const [state, setState] = useState(() => map(reactive));

    useEffect(() => {
        const handleUpdate = () => setState(map(reactive));
        reactive.onChange.addListener(handleUpdate);
        return () => {
            reactive.onChange.removeListener(handleUpdate);
        };
    }, [reactive, map]);

    return state;
}

export function useReactiveAll<T extends Reactive[], U>(reactives: T, map: (reactives: T) => U): U {
    const [state, setState] = useState(() => map(reactives));

    useEffect(() => {
        const cleanUps = reactives.map((reactive) => reactive.onChange.addListener(() => setState(map(reactives))));
        return () => cleanUps.forEach((cleanUp) => cleanUp());
    }, [map, reactives]);

    return state;
}
