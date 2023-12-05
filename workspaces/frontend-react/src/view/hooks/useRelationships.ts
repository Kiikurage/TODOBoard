import { Relationship } from '../../model/Relationship';
import { readRelationships } from '../../usecase/readRelationships';
import { singleton } from '../../lib/singleton';
import { useFlow } from './useFlow';

const flow = singleton(() => readRelationships());

export function useRelationships(): ReadonlyMap<string, Relationship> {
    return useFlow(flow());
}
