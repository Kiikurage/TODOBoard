import { Link } from '../../model/Link';
import { readLinks } from '../../usecase/readLinks';
import { useDataChannel } from './useDataChannel';

export function useLinks(): ReadonlyMap<string, Link> {
    return useDataChannel(readLinks());
}
