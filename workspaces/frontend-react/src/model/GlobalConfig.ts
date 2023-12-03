export class GlobalConfig {
    protected constructor(public readonly showArchivedTasks: boolean) {}

    static DEFAULT = GlobalConfig.create({
        showArchivedTasks: false,
    });

    copy(props: Partial<typeof ownProps>): GlobalConfig {
        return Object.assign(Object.create(GlobalConfig.prototype), { ...this, ...props });
    }

    static create(props: typeof ownProps): GlobalConfig {
        return Object.assign(Object.create(GlobalConfig.prototype), props);
    }
}

const ownProps = { ...GlobalConfig.prototype };
