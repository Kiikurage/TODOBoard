import { CSSObject } from '@emotion/serialize/dist/declarations/types';

export const STYLE_INPUT: CSSObject = {
    padding: '2px 0 1px',
    userSelect: 'all',
    border: 'none',
    borderBottom: '1px solid #ccc',
    font: 'inherit',
    fontWeight: 'bold',
    display: 'block',
    width: '100%',
    background: 'transparent',
    outline: 'none',
    boxSizing: 'border-box',
};

export const STYLE_INPUT_FOCUSED: CSSObject = {
    ...STYLE_INPUT,

    background: '#e7ecf2',
    paddingBottom: 0,
    borderBottomWidth: 2,
    borderBottomColor: '#aaa',
};
