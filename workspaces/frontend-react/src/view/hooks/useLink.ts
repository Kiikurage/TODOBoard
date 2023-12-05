import { Link } from '../../model/Link';
import { readLinks } from '../../usecase/readLinks';
import { singleton } from '../../lib/singleton';
import { useFlow } from './useFlow';

const flow = singleton(() => readLinks());

export function useLink(): ReadonlyMap<string, Link> {
    return useFlow(flow());
}
