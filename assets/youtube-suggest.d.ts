declare module 'youtube-suggest' {
    export default function (query: string): Promise<string[]>;
}
