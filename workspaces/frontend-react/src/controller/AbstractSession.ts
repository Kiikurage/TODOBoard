import { Disposable, dispose } from '../lib/Disposable';
import { Channel } from '../lib/Channel';
import { Reactive } from '../lib/Reactive';

/**
 * セッションの基底クラス。セッションは「開始」「状態更新」「終了」といったライフサイクルを持ち、
 * アプリケーション起動中に複数回ライフサイクルを繰り返す。各ライフサイクル毎にセッションインスタンスは破棄され作り直される。
 *
 * セッションの状態は一時データであり、通常、永続化されない。
 */
export abstract class AbstractSession<T> implements Disposable, Reactive {
    public readonly onChange = new Channel();
    public readonly onEnd = new Channel();

    private _state: T;

    protected constructor(initialState: T) {
        this._state = initialState;
    }

    get state() {
        return this._state;
    }

    protected set state(state: T) {
        this._state = state;
        this.onChange.fire();
    }

    [Disposable.dispose]() {
        this.onEnd.fire();
        dispose(this.onChange);
        dispose(this.onEnd);
        dispose(this._state);
    }
}
