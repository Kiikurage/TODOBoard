import { useEffect, useState } from 'react';
import { Flow } from '../../lib/flow/Flow';

export function useFlow<T>(flow: Flow<T>): T {
    const [value, setValue] = useState(() => flow.get());

    useEffect(() => flow.subscribe(setValue), [flow]);

    return value;
}
