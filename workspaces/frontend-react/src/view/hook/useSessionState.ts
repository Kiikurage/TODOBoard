import { AbstractSession } from '../../controller/AbstractSession';
import { useReactive } from './useReactive';

export function useSessionState<T>(session: AbstractSession<T>): T {
    return useReactive(session, () => session.state);
}
