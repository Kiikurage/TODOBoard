import { AppShell } from './AppShell';
import { Global } from '@emotion/react';

export function App() {
    return (
        <>
            <GlobalStyle />
            <AppShell />
        </>
    );
}

export const GlobalStyle = () => (
    <Global
        styles={{
            html: {
                fontFamily:
                    'ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, "Hiragino Sans", "Hiragino Kaku Gothic ProN", "Hiragino Sans GB", メイリオ, Meiryo, "Apple Color Emoji", Arial, sans-serif, "Segoe UI Emoji", "Segoe UI Symbol"',
                fontSize: '16px',
            },
        }}
    />
);
