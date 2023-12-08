import { useEffect, useState } from 'react';
import { DataChannel } from '../../lib/channel/DataChannel';

export function useDataChannel<T>(channel: DataChannel<T>): T {
    const [value, setValue] = useState(() => channel.get());

    useEffect(() => channel.addListener(setValue), [channel]);

    return value;
}
