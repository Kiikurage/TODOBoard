import { useSyncExternalStore } from 'react';
import { globalConfigStorage } from '../../deps';
import { GlobalConfig } from '../../model/GlobalConfig';

export function useGlobalConfig(): GlobalConfig {
    return useSyncExternalStore(
        (callback) => {
            globalConfigStorage.addListener(callback);
            return () => globalConfigStorage.removeListener(callback);
        },
        () => globalConfigStorage.get(),
    );
}
