class Dataclass<OwnProps extends Record<string, unknown>> {
    constructor(props: OwnProps) {
        Object.assign(this, props);
    }

    copy(props: Partial<OwnProps> = {}): this {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return new (this as any).constructor({ ...this, ...props });
    }

    toString(): string {
        return `${this.constructor.name}(${[...Object.entries({ ...this })]
            .map(([k, v]) => `${k}=${v.toString()}`)
            .join(', ')})`;
    }
}

export function dataclass<T>() {
    interface DataClass {
        copy(props?: Partial<T>): this;
        toString(): string;
    }

    return Dataclass as never as {
        new (props: T): Readonly<T> & DataClass;
    };
}
