export type Status = 'normal' | 'info' | 'success' | 'warning' | 'danger';

const colorsByStatus: Record<Status, string> = {
    normal: '#6e6e6e',
    info: '#2196f3',
    success: '#3db66d',
    warning: '#f57c00',
    danger: '#f44336',
};

export const colors = {
    status: colorsByStatus,

    background: '#f2f4fc',
    backgroundWeak: '#eaeaf3',
    border: '#e0e0e0',
};
