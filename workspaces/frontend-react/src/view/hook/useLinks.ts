import { Link } from '../../model/Link';
import { useDataChannel } from './useDataChannel';
import { ReadLinksUseCase } from '../../usecase/ReadLinksUseCase';

export function useLinks(readLinks: ReadLinksUseCase): ReadonlyMap<string, Link> {
    return useDataChannel(readLinks());
}
