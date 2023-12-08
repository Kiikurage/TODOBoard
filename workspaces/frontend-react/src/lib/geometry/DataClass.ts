/**
 *  isSpereadableProperty() is the core method to evalue the type of spread operation applied to Class instance.
 *
 *   function isSpreadableProperty(prop: Symbol): boolean {
 *         return !some(prop.declarations, isPrivateIdentifierClassElementDeclaration) &&
 *             (!(prop.flags & (SymbolFlags.Method | SymbolFlags.GetAccessor | SymbolFlags.SetAccessor)) ||
 *                 !prop.declarations?.some(decl => isClassLike(decl.parent)));
 *     }
 *
 *  @see https://raw.githubusercontent.com/microsoft/TypeScript/main/src/compiler/checker.ts
 */

type IfEquals<X, Y, A = X, B = never> = (<T>() => T extends X ? 1 : 2) extends <T>() => T extends Y ? 1 : 2 ? A : B;

type OwnProps<T> = {
    [P in keyof T]: T[P] extends Function ? never : T[P];
};

const pp1: OwnProps<Point> = { x: 0, y: 0 };
const pp2: OwnProps<Point> = { callback: () => p1 };
const pp3: OwnProps<Point> = { sum: 0 };
const pp4: OwnProps<Point> = { copy: () => p1 };

class Point {
    constructor(
        public readonly x: number,
        public readonly y: number,
        public readonly callback: () => void,
    ) {}

    get sum() {
        return this.x + this.y;
    }

    copy(props: Partial<OwnProps<Point>>): Point {
        return Object.assign(Object.create(Object.getPrototypeOf(this)), this, props);
    }
    static test(): boolean {
        return true;
    }
}

type f1 = OwnProps<Point>;

const p1 = new Point(0, 0);
const p2 = p1.copy({ x: 0, y: 0 });
const p3 = p1.copy({ sum: 0 });
const p4 = p1.copy({ copy: () => p1 });

const x = p1.constructor.test();

console.log(p1, p2, p3, p4);
