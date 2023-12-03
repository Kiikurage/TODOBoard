import { useEffect, useState } from 'react';
import { relationshipStorage, taskStorage } from '../deps';
import { Relationship } from '../model/Relationship';
import { readRelationships } from '../usecase/readRelationships';

export function useRelationships(includeArchivedTaskRelationships: boolean = false): ReadonlyMap<string, Relationship> {
    const [relationships, setRelationships] = useState<ReadonlyMap<string, Relationship>>(() =>
        readRelationships(includeArchivedTaskRelationships),
    );

    useEffect(() => {
        const callback = () => setRelationships(readRelationships(includeArchivedTaskRelationships));

        taskStorage.addListener(callback);
        relationshipStorage.addListener(callback);
        return () => {
            taskStorage.removeListener(callback);
            relationshipStorage.removeListener(callback);
        };
    }, [includeArchivedTaskRelationships]);

    const [prevIncludeArchivedTaskRelationships, setPrevIncludeArchivedTaskRelationships] = useState(
        includeArchivedTaskRelationships,
    );
    if (includeArchivedTaskRelationships !== prevIncludeArchivedTaskRelationships) {
        setRelationships(readRelationships(includeArchivedTaskRelationships));
        setPrevIncludeArchivedTaskRelationships(includeArchivedTaskRelationships);
    }

    return relationships;
}
