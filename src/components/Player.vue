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
    },
    setup(props) {
        const video = ref(null);
        const player = ref<Plyr>(null);

        onMounted(() => {
            player.value = new Plyr(video.value as HTMLElement, {
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
                type: 'video',
                sources: props.sources.map((format) => {
                    return {
                        src: format.url,
                        type: format.mimeType,
                        size: format.height,
                    };
                }),
            };
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
