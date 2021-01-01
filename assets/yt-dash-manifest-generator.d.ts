declare module 'yt-dash-manifest-generator' {
    // eslint-disable-next-line camelcase
    export function generate_dash_file_from_json_data(
        json: string,
        videoLength: number
    ): string;

    // eslint-disable-next-line camelcase
    export function generate_dash_file_from_json_data_from_id(
        id: string,
        videoLength: number
    ): string;

    // eslint-disable-next-line camelcase
    export function generate_dash_file_from_formats(
        formats: object[],
        videoLength: number
    ): string;
}
