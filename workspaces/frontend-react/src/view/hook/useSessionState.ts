import { useEffect, useState } from 'react';
import { AbstractSession } from '../../controller/AbstractSession';

export function useSessionState<T>(session: AbstractSession<T>): T {
    const [state, setState] = useState(session.state);

    useEffect(() => {
        const handleUpdate = (state: T) => setState(state);
        const handleEnd = () => {
            session.onUpdate.removeListener(handleUpdate);
            session.onEnd.removeListener(handleEnd);
        };
        session.onUpdate.addListener(handleUpdate);
        session.onEnd.addListener(handleEnd);
        return () => {
            session.onUpdate.removeListener(handleUpdate);
            session.onEnd.removeListener(handleEnd);
        };
    }, [session]);

    return state;
}
