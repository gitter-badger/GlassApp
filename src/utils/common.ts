export function degToRad(angle: number) {
    return angle * (Math.PI / 180);
}

export function radToDeg(angle: number) {
    return angle * (180 / Math.PI);
}

export function mapIfExists<T, U>(value: T | null, f: (value: T) => U): U | null;
export function mapIfExists<T, U>(value: T | undefined, f: (value: T) => U): U | undefined;
export function mapIfExists<T, U>(
    value: T | null | undefined,
    f: (value: T) => U
): U | null | undefined {
    if (value == null) return value as null | undefined;
    return f(value);
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
