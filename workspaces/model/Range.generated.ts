interface Range {
    from: number;
    to: number;
}

export abstract class RangeBase implements Range {
    constructor(
        public readonly from: number,
        public readonly to: number,
    ) {}

    get size() {
        return this.to - this.from;
    }

    setSize(value: number): RangeBase {
        return this.copy({
            to: this.from + value,
        });
    }

    copy(props: Partial<Range>): RangeBase {
        return Object.assign(Object.create(RangeBase.prototype), this, props);
    }

    equals(other: Range): boolean {
        return this.from === other.from && this.to === other.to;
    }

    static create(props: Range) {
        return this.prototype.copy(props);
    }

    toString(): string {
        return `Range(${this.from}, ${this.to})`;
    }
}
