import { colors } from './style';
import { Button } from './Button';

export const AppShell = () => {
    return (
        <div
            css={{
                position: 'fixed',
                inset: 0,
                background: colors.background,
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'stretch',
                alignItems: 'stretch',
            }}
        >
            <div
                css={{
                    flex: '0 0 auto',
                    width: '48px',
                    background: colors.backgroundWeak,
                    borderRight: `1px solid ${colors.border}`,
                    boxSizing: 'border-box',
                }}
            ></div>
            <div css={{ flex: '1 1 0', minHeight: 0, position: 'relative' }}>
                <NoteListPage />
            </div>
        </div>
    );
};

export const NoteListPage = () => {
    return (
        <div
            css={{
                position: 'absolute',
                inset: 0,
                overflow: 'auto',
            }}
        >
            <Article />
        </div>
    );
};

export const Article = () => (
    <div
        css={{
            padding: '48px 48px',

            '> *:first-child': {
                marginTop: 0,
            },
            '> *:last-child': {
                marginBottom: 0,
            },

            h1: {
                fontSize: '2.5rem',
                lineHeight: '1.2',
                margin: '2rem 0',
            },
            h2: {
                fontSize: '1.8rem',
                lineHeight: '1.3',
                margin: '2rem 0',
            },
            p: {
                lineHeight: '1.5',
                margin: '1rem 0',
            },
        }}
    >
        <h1>Designing 3D world 3Dのデザイン</h1>
        <h2>
            Combining shapes
            <br />
            形を組み合わせる
        </h2>
        <p>
            To design complex shapes with SDF, you need to combine multiple different shapes. We have already seen [how
            taking the minimum of two SDFs can merge
            shapes](https://www.notion.so/003c84a2640641b7bbea9ffb44b46cc2?pvs=21). In this section, we will explore
            other useful functions. These functions are all from [Inigo Quilez's
            article](https://iquilezles.org/articles/distfunctions/).
        </p>
        <p>
            複雑な形状をSDFで作るには、複数の異なる形を組み合わせる必要があります。すでに[2つのSDFの最小値を取ることで形状を結合する方法](https://www.notion.so/003c84a2640641b7bbea9ffb44b46cc2?pvs=21)について触れました。このセクションでは、その他の便利な関数について説明します。これらの関数はすべて、[Inigo
            Quilezの記事](https://iquilezles.org/articles/distfunctions/)が出典です。
        </p>
        <h2>
            Boolean operations
            <br />
            ブール演算
        </h2>
        <p>
            Boolean operations are a common concept used in various design tools. With SDF, boolean operations such as
            union, intersection, and difference can be expressed as simple comparisons of distances, allowing you to
            sculpt various shapes.
        </p>
        <p>
            ブール演算は、さまざまなデザインツールで使われています。SDFでは簡単な距離の比較を用いて、和（union）、共通部分（intersection）、差（subtraction）などのブール演算を表現することができます。これを使うとさまざまな形状を造ることができます。
        </p>
        <h2>
            Learn more
            <br />
            もっと学ぶ
        </h2>
        <p>
            We have only scratched the surface of 3D rendering with SDF. This is a deep rabbit hole where you can spend
            an infinite amount of time experimenting and mastering it. It is also very handy for experimenting with
            various 3D rendering techniques and concepts, such as [physically-based
            rendering](https://codepen.io/kynd/pen/MWLvBRe?editors=0010). To learn more, [Inigo
            Quilez's](https://iquilezles.org/) website, which I have cited multiple times, is the best and one of the
            most comprehensive resources for learning SDF-based 3D techniques. Explore the site to discover a wide range
            of techniques and knowledge beyond what we have covered.
        </p>
        <p>
            これはSDFを使った3Dレンダリングのほんのさわりです。これは奥深い分野で、いくらでも時間をかけて実験したり、技術を磨くことができます。また、[物理ベースレンダリング](https://codepen.io/kynd/pen/MWLvBRe?editors=0010)など、さまざまな3Dレンダリングの技術や概念の実験にも非常に便利です。SDFベースの3D技術についてさらに学ぶためには、ここまで何度も引用した[Inigo
            Quilez](https://iquilezles.org/)のウェブサイトが最も包括的な資料です。サイトを探索して、ここまででカバーした範囲を超えたさまざまな技術や知識を発見しましょう。
            [Index](https://www.notion.so/Index-ad8eba2882cd4a00b22ca18be39d1ecb?pvs=21)
        </p>

        <div css={{ display: 'flex', flexDirection: 'row', gap: '16px', alignItems: 'center' }}>
            <Button>追加</Button>
            <Button status="danger">削除</Button>
            <Button status="success">保存</Button>
            <Button status="info">開始</Button>
            <Button status="warning">確認</Button>
        </div>
        <div css={{ display: 'flex', flexDirection: 'row', gap: '16px', alignItems: 'center' }}>
            <Button variant="text">追加</Button>
            <Button variant="text" status="danger">
                削除
            </Button>
            <Button variant="text" status="success">
                保存
            </Button>
            <Button variant="text" status="info">
                開始
            </Button>
            <Button variant="text" status="warning">
                確認
            </Button>
        </div>
    </div>
);
