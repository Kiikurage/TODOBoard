/**
 * エラーを投げる関数。式の途中など、throw文が使えない場所でも使用可能。
 *
 * @example
 * const item = repository.findById(id) ?? throwError('not found');
 */
export function throwError(message: string): never {
    throw new Error(message);
}
