import { initArgument, Middleware } from '@core/middleware';

export interface Argument {
    displayUpList: 'auto' | 'show' | 'hide';
    purifyComment: boolean | number;
    sponsorBlock: boolean | string;
}

export const withArgument: Middleware = initArgument({
    displayUpList: 'show',
    purifyComment: true,
    sponsorBlock: true,
} as Argument);
