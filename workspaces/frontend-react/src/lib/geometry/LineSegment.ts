import { Point } from './Point';

export class LineSegment {
    constructor(
        public readonly p1: Point,
        public readonly p2: Point,
    ) {}

    copy(props: Partial<typeof ownProps>): LineSegment {
        return Object.assign(Object.create(LineSegment.prototype), this, props);
    }

    static create(props: typeof ownProps): LineSegment {
        return LineSegment.prototype.copy(props);
    }
}

const ownProps = { ...LineSegment.prototype };
