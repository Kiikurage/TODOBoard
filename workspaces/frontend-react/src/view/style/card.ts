import { CSSObject } from '@emotion/serialize/dist/declarations/types';
import { COLOR_ACTIVE } from './Colors'; // https://codepen.io/sdthornton/pen/wBZdXq

// https://codepen.io/sdthornton/pen/wBZdXq

export const STYLE_CARD: CSSObject = {
    borderRadius: 4,
    background: '#fff',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24)',
    transition: 'box-shadow 80ms ease-in',
};

export const STYLE_CARD__ACTIVE: CSSObject = {
    ...STYLE_CARD,
    boxShadow: '0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22)',
};

export const STYLE_CARD__ACTIVE_BORDERED: CSSObject = {
    ...STYLE_CARD__ACTIVE,
    outline: `2px solid ${COLOR_ACTIVE}`,
};
