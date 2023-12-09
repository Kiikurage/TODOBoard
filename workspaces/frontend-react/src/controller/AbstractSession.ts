import { Disposable, dispose } from '../lib/Disposable';
import { Channel } from '../lib/channel/Channel';

/**
 * 状態を持つが、アプリケーション起動中に複数回、初期化・破棄される可能性があるコントローラ
 */
export class AbstractSession implements Disposable {
    public readonly onEnd = new Channel();

    protected constructor() {}

    [Disposable.dispose]() {
        this.onEnd.fire();
        dispose(this.onEnd);
    }
}
