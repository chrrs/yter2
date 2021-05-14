<template>
    <div>
        <video ref="video" autofocus autoplay></video>
    </div>
</template>

<script lang="ts">
import { onBeforeUnmount, onMounted, PropType, ref } from 'vue';
import Plyr from 'plyr';
import 'plyr/dist/plyr.css';
import { VideoFormat } from '../api_v1/api_v1';

export default {
    name: 'Player',
    props: {
        sources: {
            type: Array as PropType<Array<VideoFormat>>,
            required: true,
        },
        storyboards: {
            type: String,
            default: '',
        },
        poster: {
            type: String,
            default: '',
        },
    },
    setup(
        props: {
            sources: Array<VideoFormat>;
            storyboards: string;
            poster: string;
        },
        { emit }
    ) {
        const video = ref<HTMLElement | null>(null);
        const player = ref<Plyr | null>(null);

        onMounted(() => {
            player.value = new Plyr(video.value || '', {
                settings: ['quality', 'speed'],
                quality: {
                    default: 1080,
                    options: [
                        4320,
                        2160,
                        1440,
                        1080,
                        720,
                        576,
                        480,
                        360,
                        240,
                        144,
                    ],
                },
                previewThumbnails: {
                    src: props.storyboards,
                    enabled: true,
                },
            });

            player.value.source = {
                poster: props.poster,
                type: 'video',
                sources: props.sources.map((format) => {
                    return {
                        src: format.url,
                        type: format.mimeType,
                        size: format.height,
                    };
                }),
            };

            const button = document.createElement('button');
            button.className = 'plyr__controls__item plyr__control';
            button.innerHTML =
                '<svg width="18" height="18" style="fill: transparent">' +
                '<rect x="1" y="3" width="16" height="12" style="stroke: white; stroke-width: 2"></rect>' +
                '</svg>';

            button.onclick = () => {
                emit('theatre-mode');
            };

            document
                .querySelector('.plyr__controls')
                .insertBefore(
                    button,
                    document.querySelector(
                        '.plyr__control[data-plyr="fullscreen"]'
                    )
                );
        });

        onBeforeUnmount(() => {
            player.value?.destroy();
        });

        return {
            video,
            player,
        };
    },
};
</script>
