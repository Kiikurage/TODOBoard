import { Disposable, dispose } from '../lib/Disposable';
import { Channel } from '../lib/channel/Channel';

/**
 * セッションの基底クラス。セッションは「開始」「状態更新」「終了」といったライフサイクルを持ち、
 * アプリケーション起動中に複数回ライフサイクルを繰り返す。各ライフサイクル毎にセッションインスタンスは破棄され作り直される。
 *
 * セッションの状態は一時データであり、通常、永続化されない。
 */
export class AbstractSession implements Disposable {
    public readonly onEnd = new Channel();

    protected constructor() {}

    [Disposable.dispose]() {
        this.onEnd.fire();
        dispose(this.onEnd);
    }
}
