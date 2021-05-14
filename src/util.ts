import { Image } from './api_v1/api_v1';

export function chooseImage(
    images: Array<Image>,
    desiredWidth: number = Infinity
) {
    return (
        images
            .slice()
            .filter((t) => desiredWidth <= t.width && desiredWidth <= t.height)
            .sort((a, b) => a.width - b.width)[0] ||
        images.slice().sort((a, b) => b.width - a.width)[0]
    );
}

export function formatNumber(num: number, digits = 2) {
    const si = [
        { value: 1, symbol: '' },
        { value: 1e3, symbol: 'K' },
        { value: 1e6, symbol: 'M' },
        { value: 1e9, symbol: 'G' },
        { value: 1e12, symbol: 'T' },
        { value: 1e15, symbol: 'P' },
        { value: 1e18, symbol: 'E' },
    ];

    const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;

    let i;
    for (i = si.length - 1; i > 0; i--) {
        if (num >= si[i].value) {
            break;
        }
    }

    return (num / si[i].value).toFixed(digits).replace(rx, '$1') + si[i].symbol;
}

export function formatSeconds(seconds: number) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor(seconds / 60) % 60;
    seconds %= 60;

    let out =
        hours === 0
            ? `${minutes}`
            : `${hours}:${minutes.toString().padStart(2, '0')}`;
    out += `:${seconds.toString().padStart(2, '0')}`;
    return out;
}

export type Procedure = (...args: any[]) => void;

export interface DebouncedFunction<F extends Procedure> {
    (this: ThisParameterType<F>, ...args: Parameters<F>): void;

    cancel: () => void;
}

export function debounce<F extends Procedure>(
    func: F,
    waitMilliseconds = 50,
    immediate = false
): DebouncedFunction<F> {
    let timeoutId: ReturnType<typeof setTimeout> | undefined;

    const debouncedFunction = function (
        this: ThisParameterType<F>,
        ...args: Parameters<F>
    ) {
        const context = this;

        const doLater = function () {
            timeoutId = undefined;
            if (!immediate) {
                func.apply(context, args);
            }
        };

        const shouldCallNow = immediate && timeoutId === undefined;

        if (timeoutId !== undefined) {
            clearTimeout(timeoutId);
        }

        timeoutId = setTimeout(doLater, waitMilliseconds);

        if (shouldCallNow) {
            func.apply(context, args);
        }
    };

    debouncedFunction.cancel = function () {
        if (timeoutId !== undefined) {
            clearTimeout(timeoutId);
        }
    };

    return debouncedFunction;
}

export function parseDuration(duration: string): number {
    const parts = duration.split(':').map((i) => parseInt(i));

    switch (parts.length) {
        case 3:
            return parts[0] * 3600 + parts[1] * 60 + parts[2];
        case 2:
            return parts[0] * 60 + parts[1];
        default:
            return parts[0];
    }
}
