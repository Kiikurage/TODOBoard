import styled from '@emotion/styled';
import { colors, Status } from './style';

function getButtonBaseStyle() {
    return {
        border: 'none',
        fontSize: '1em',
        borderRadius: '4px',
        padding: '0.3em 1em',
        cursor: 'pointer',
    };
}

function getFilledButtonStyle(status: Status) {
    return {
        ...getButtonBaseStyle(),
        background: colors.status[status],
        color: '#fff',
    };
}

function getTextButtonStyle(status: Status) {
    return {
        ...getButtonBaseStyle(),
        background: 'transparent',
        color: colors.status[status],
    };
}

export const Button = styled.button((props: { variant?: 'filled' | 'text'; status?: Status }) => {
    const { variant = 'filled', status = 'normal' } = props;

    switch (variant) {
        case 'filled':
            return getFilledButtonStyle(status);

        case 'text':
            return getTextButtonStyle(status);
    }
});
