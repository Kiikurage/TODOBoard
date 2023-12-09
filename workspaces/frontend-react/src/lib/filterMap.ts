export function filterMap<K, V>(map: ReadonlyMap<K, V>, filter: (key: K, value: V) => boolean): ReadonlyMap<K, V>;
export function filterMap<K, V>(map: Map<K, V>, filter: (key: K, value: V) => boolean): Map<K, V>;
export function filterMap<K, V>(map: ReadonlyMap<K, V>, filter: (key: K, value: V) => boolean): ReadonlyMap<K, V> {
    const result = new Map<K, V>();
    for (const [key, value] of map.entries()) {
        if (filter(key, value)) {
            result.set(key, value);
        }
    }
    return result;
}

export function filterMapByKey<K, V>(map: ReadonlyMap<K, V>, filter: (key: K) => boolean): ReadonlyMap<K, V>;
export function filterMapByKey<K, V>(map: Map<K, V>, filter: (key: K) => boolean): Map<K, V>;
export function filterMapByKey<K, V>(map: ReadonlyMap<K, V>, filter: (key: K) => boolean): ReadonlyMap<K, V> {
    const result = new Map<K, V>();
    for (const [key, value] of map.entries()) {
        if (filter(key)) {
            result.set(key, value);
        }
    }
    return result;
}

export function filterMapByValue<K, V>(map: ReadonlyMap<K, V>, filter: (value: V) => boolean): ReadonlyMap<K, V>;
export function filterMapByValue<K, V>(map: Map<K, V>, filter: (value: V) => boolean): Map<K, V>;
export function filterMapByValue<K, V>(map: ReadonlyMap<K, V>, filter: (value: V) => boolean): ReadonlyMap<K, V> {
    const result = new Map<K, V>();
    for (const [key, value] of map.entries()) {
        if (filter(value)) {
            result.set(key, value);
        }
    }
    return result;
}
