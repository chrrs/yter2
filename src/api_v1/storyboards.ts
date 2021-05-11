import ytdl from 'ytdl-core';

export function parseStoryboard(
    storyboard: ytdl.storyboard,
    lengthSeconds: number
): { [key: string]: string } {
    const out: { [key: string]: string } = {};
    const interval = storyboard.interval / 1000;
    let i = 0;
    let time = 0;

    while (true) {
        const url = storyboard.templateUrl.replace('$M', i.toString());

        for (let row = 0; row < storyboard.rows; row++) {
            for (let col = 0; col < storyboard.columns; col++) {
                out[time.toString()] = `${url}#xywh=${
                    col * storyboard.thumbnailWidth
                },${row * storyboard.thumbnailHeight},${
                    storyboard.thumbnailWidth
                },${storyboard.thumbnailHeight}`;

                if (time > lengthSeconds) {
                    return out;
                }

                time += interval;
            }
        }

        i++;
    }
}

export function getStoryboardVTT(
    storyboard: ytdl.storyboard,
    lengthSeconds: number
): string {
    const parsed = parseStoryboard(storyboard, lengthSeconds);
    const interval = storyboard.interval / 1000;
    let out = 'WEBVTT';

    for (const key in parsed) {
        const time = parseInt(key);
        const url = parsed[key];

        out += `\n\n${timeToString(time)} --> ${timeToString(
            time + interval
        )}\n${url}`;
    }

    return out;
}

function timeToString(time: number): string {
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor(time / 60) % 60;
    const seconds = time % 60;

    return `${hours.toString().padStart(2, '0')}:${minutes
        .toString()
        .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.000`;
}
