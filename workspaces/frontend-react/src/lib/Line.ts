import { throwError } from './throwError';
import { Point } from './Point';
import { Rect } from './Rect';

export type LineParameters = [a: number, b: number, c: number];

export function getPathPoints(p1: Point, p2: Point, task: Rect): Point | null {
    if (p1[0] === p2[0] && p1[1] === p2[1]) return null;

    const line1 = getLineParameters(p1, p2);

    for (const [taskP1, taskP2] of [
        [Point(task.x, task.y), Point(task.x + task.width, task.y)],
        [Point(task.x, task.y), Point(task.x, task.y + task.height)],
        [Point(task.x + task.width, task.y), Point(task.x + task.width, task.y + task.height)],
        [Point(task.x, task.y + task.height), Point(task.x + task.width, task.y + task.height)],
    ]) {
        const line2 = getLineParameters(taskP1, taskP2);

        const point = getIntersectionPoint(line1, line2);
        if (point === null) continue;
        if (point[0] < taskP1[0]) continue;
        if (point[0] > taskP2[0]) continue;
        if (point[1] < taskP1[1]) continue;
        if (point[1] > taskP2[1]) continue;

        if (point[0] < Math.min(p1[0], p2[0])) continue;
        if (point[0] > Math.max(p1[0], p2[0])) continue;
        if (point[1] < Math.min(p1[1], p2[1])) continue;
        if (point[1] > Math.max(p1[1], p2[1])) continue;

        return point;
    }

    console.warn(p1, p2, task);
    throwError('Unreachable');
}

export function getLineParameters([x1, y1]: Point, [x2, y2]: Point): LineParameters {
    return [x2 - x1, y1 - y2, x1 * y2 - x2 * y1];
}

export function getIntersectionPoint([a1, b1, c1]: LineParameters, [a2, b2, c2]: LineParameters): Point | null {
    const denominator = a1 * b2 - a2 * b1;
    if (denominator === 0) return null;

    return [(a2 * c1 - a1 * c2) / denominator, (b1 * c2 - b2 * c1) / denominator];
}
