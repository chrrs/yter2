<template>
    <div>
        <video ref="video" autofocus autoplay></video>
    </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import Plyr from 'plyr';
import 'plyr/dist/plyr.css';
import { VideoSource } from '~/assets/api_types';

export default Vue.extend({
    name: 'Player',
    props: {
        sources: {
            type: Array as PropType<Array<VideoSource>>,
            required: true,
        },
        storyboards: {
            type: String,
            default: '',
        },
    },
    data() {
        return {
            player: null as Plyr | null,
        };
    },
    mounted() {
        this.player = new Plyr(this.$refs.video as HTMLElement, {
            settings: ['quality', 'speed'],
            quality: {
                default: 1080,
                options: [4320, 2160, 1440, 1080, 720, 576, 480, 360, 240, 144],
            },
            previewThumbnails: {
                src: this.storyboards,
                enabled: true,
            },
        });

        this.player.source = {
            type: 'video',
            sources: this.sources.map((s: VideoSource) => {
                return {
                    src: s.url,
                    type: s.type,
                    size: parseInt(s.qualityLabel.replace(/p(60)?/g, '')),
                };
            }),
        };
    },
    beforeDestroy() {
        if (this.player) {
            this.player.destroy();
        }
    },
});
</script>
