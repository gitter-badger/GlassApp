/**
 * Deletes an `item` from the array.
 */
export function deleteItem<T>(arr: T[], item: T): T[] {
    const idx = arr.findIndex(arrItem => arrItem === item);
    if (idx < 0) return arr;
    arr.splice(idx, 1);
    return arr;
}

/**
 * Generates a window of values
 *
 * @example
 * slidingWindow([1, 2, 3, 4], 2) === [[1, 2], [2, 3], [3, 4]]
 */
export function slidingWindow<T>(arr: T[], size: number): T[][] {
    if (size > arr.length) return [];

    const results: T[][] = [];
    // [a, b, c] size = 2
    //
    for (let windowOffset = 0; windowOffset < arr.length - size + 1; windowOffset++) {
        const windowResult: T[] = [];
        for (let arrIdx = 0; arrIdx < size; arrIdx++) {
            windowResult.push(arr[arrIdx + windowOffset]);
        }
        results.push(windowResult);
    }

    return results;
}

/**
 * Filter null and undefined from an array.
 *
 * @example
 * filterNil([null, 1, 0, undefined, {}]) === [1, 0, {}]
 */
export function filterNil<T>(items: Array<T | null | undefined>): T[] {
    return items.filter(item => item != null) as T[];
}
