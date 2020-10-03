export function degToRad(angle: number) {
    return angle * (Math.PI / 180);
}

export function radToDeg(angle: number) {
    return angle * (180 / Math.PI);
}

export function mapIfExists<T, U>(
    value: T | null | undefined,
    f: (value: T) => U
): U | null | undefined {
    if (value == null) return value as null | undefined;
    return f(value);
}

export function mapAnyExists<T>(...funcs: Array<() => T | null | undefined>): T | null | undefined {
    for (const func of funcs) {
        const result = func();
        if (result != null) return result;
    }
}

export function headingFromCoords(start: [number, number], end: [number, number]): number {
    const coordVec = [end[0] - start[0], end[1] - start[1]];
    let heading = radToDeg(Math.atan2(coordVec[0], coordVec[1]));
    if (coordVec[0] < 0) {
        heading += 360;
    }
    heading = heading % 360;

    return heading;
}
export function feetToNauticalMiles(value: number): number {
    return value / 6076.11549;
}

export function arrRange(start: number, end: number) {
    const result: number[] = [];
    for (let i = start; i < end; i++) {
        result.push(i);
    }

    return result;
}

export function filterNil<T>(items: Array<T | null | undefined>): T[] {
    return items.filter(item => item != null) as T[];
}

export async function delayMs(ms: number): Promise<void> {
    return new Promise<void>(resolve => setTimeout(resolve, ms));
}

export function mapRange(
    value: number,
    fromMin: number,
    fromMax: number,
    toMin: number,
    toMax: number
): number {
    return ((value - fromMin) * (toMax - toMin)) / (fromMax - fromMin) + toMin;
}

export function arrDelete<T>(arr: T[], item: T): T[] {
    const idx = arr.findIndex(arrItem => arrItem === item);
    if (idx < 0) return arr;
    arr.splice(idx, 1);
    return arr;
}

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

export function interval(fn: () => void, ms: number): () => void {
    const i = setInterval(fn, ms);
    return () => clearInterval(i);
}
