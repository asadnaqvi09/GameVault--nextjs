// src/app/fonts.ts
import { Work_Sans } from 'next/font/google';
import localFont from 'next/font/local';

export const workSans = Work_Sans({
    subsets: ['latin'],
    display: 'swap',
    variable: '--font-work-sans', // Defines the CSS variable
});

export const satoshi = localFont({
    src: [
        {
            path: '../../public/fonts/Satoshi_Complete/Fonts/WEB/fonts/Satoshi-Regular.woff2',
            weight: '400',
            style: 'normal',
        },
        {
            path: '../../public/fonts/Satoshi_Complete/Fonts/WEB/fonts/Satoshi-Bold.woff2',
            weight: '700',
            style: 'normal',
        },
    ],
    variable: '--font-satoshi', // Defines the CSS variable
});
