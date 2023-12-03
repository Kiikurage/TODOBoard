import { useSyncExternalStore } from 'react';
import { relationshipStorage } from '../deps';
import { Relationship } from '../model/Relationship';

export function useRelationships(): ReadonlyMap<string, Relationship> {
    return useSyncExternalStore(
        (callback) => {
            relationshipStorage.addListener(callback);
            return () => relationshipStorage.removeListener(callback);
        },
        () => relationshipStorage.readAll(),
    );
}
