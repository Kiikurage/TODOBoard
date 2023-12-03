import { GlobalConfig } from '../model/GlobalConfig';

export class GlobalConfigRepository {
    private readonly callbacks = new Set<() => void>();
    private config = GlobalConfig.DEFAULT;

    addListener(callback: () => void) {
        this.callbacks.add(callback);
    }

    removeListener(callback: () => void) {
        this.callbacks.delete(callback);
    }

    get(): GlobalConfig {
        return this.config;
    }

    save(config: GlobalConfig) {
        this.config = config;
        this.callbacks.forEach((callback) => callback());
    }
}
