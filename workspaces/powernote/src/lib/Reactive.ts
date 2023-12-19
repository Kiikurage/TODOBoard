import { Channel } from './Channel';

export interface Reactive {
    readonly onChange: Channel;
}
