import { Disposable, dispose, SymbolDispose } from '../lib/Disposable';
import { Channel } from '../lib/channel/Channel';

export class AbstractSession implements Disposable {
    public readonly onEnd = new Channel();

    protected constructor() {}

    [SymbolDispose]() {
        this.onEnd.fire();
        dispose(this.onEnd);
    }
}
