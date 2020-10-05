export type nil = null | undefined;

/**
 * Convert degrees to radians
 */
export function degToRad(angle: number): number {
    return angle * (Math.PI / 180);
}

/**
 * Convert radians to degrees
 */
export function radToDeg(angle: number): number {
    return angle * (180 / Math.PI);
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

/**
 * Resolves after `ms` milliseconds.
 */
export async function delayMs(ms: number): Promise<void> {
    return new Promise<void>(resolve => setTimeout(resolve, ms));
}

/**
 * Converts a value within the domain of `[fromMin, fromMax]` to `[toMin, toMax]`
 *
 * @example
 * mapRange(0.75, 0, 1, 0, 100) === 75
 */
export function mapRange(
    value: number,
    fromMin: number,
    fromMax: number,
    toMin: number,
    toMax: number
): number {
    return ((value - fromMin) * (toMax - toMin)) / (fromMax - fromMin) + toMin;
}

export type Disposer = () => void;

export function interval(fn: () => void, ms: number): Disposer {
    const i = setInterval(fn, ms);
    return () => clearInterval(i);
}
