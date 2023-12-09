import { Disposable } from '../lib/Disposable';
import { Channel } from '../lib/Channel';
import { Reactive } from '../lib/Reactive';

/**
 * セッションの基底クラス。セッションは「開始」「状態更新」「終了」というライフサイクルを持ったコントローラである。
 * セッションの初期状態は常に「開始」であり、「終了」状態になるとインスタンスは破棄される。
 * セッションは状態をもつ。これは通常、一時データであり永続化されない。
 */
export interface Session<T> extends Disposable, Reactive {
    readonly onChange: Channel;
    readonly onEnd: Channel;
    readonly state: T;
}
