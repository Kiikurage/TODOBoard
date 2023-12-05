import { useEffect, useState } from 'react';
import { relationshipStorage, taskStorage } from '../../deps';
import { Relationship } from '../../model/Relationship';
import { readRelationships } from '../../usecase/readRelationships';

export function useRelationships(): ReadonlyMap<string, Relationship> {
    const [relationships, setRelationships] = useState<ReadonlyMap<string, Relationship>>(() => readRelationships());

    useEffect(() => {
        const callback = () => setRelationships(readRelationships());

        taskStorage.addListener(callback);
        relationshipStorage.addListener(callback);
        return () => {
            taskStorage.removeListener(callback);
            relationshipStorage.removeListener(callback);
        };
    }, []);

    return relationships;
}
