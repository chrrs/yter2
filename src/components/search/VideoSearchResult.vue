<template>
    <ClickableDiv class="video-result" :to="`/watch?v=${video.id}`">
        <div class="thumbnail">
            <LazyImage
                :src="chooseImage(video.thumbnail, 640).url"
                alt="Video thumbnail"
            />
            <span class="video-length">
                {{ formatSeconds(video.lengthSeconds) }}
            </span>
        </div>
        <div class="video-details">
            <p class="title">{{ video.title }}</p>
            <p class="subtitle">
                {{ (video.views || 0).toLocaleString('en-US') }}
                views • {{ video.date }}
            </p>
            <div class="author">
                <LazyImage
                    :src="chooseImage(video.author.avatar, 48).url"
                    :alt="`${video.author.name}'s profile picture`"
                    class="author-avatar"
                />
                <p class="author-name">
                    <a href="#">{{ video.author.name }}</a>
                    <i
                        v-if="video.author.verified"
                        class="verified mdi mdi-check-circle"
                    ></i>
                </p>
            </div>
            <div class="description">
                {{ video.description }}
            </div>
        </div>
    </ClickableDiv>
</template>

<script lang="ts">
import { toRefs, PropType } from 'vue';
import { Video } from 'src/api_v1/api_v1';
import { chooseImage, formatSeconds } from 'src/util';
import ClickableDiv from 'components/ClickableDiv.vue';
import LazyImage from 'components/LazyImage.vue';

export default {
    name: 'VideoSearchResult',
    components: { LazyImage, ClickableDiv },
    props: {
        video: {
            type: Object as PropType<Video>,
            required: true,
        },
    },
    setup(props) {
        const { video } = toRefs(props);

        return {
            video,

            chooseImage,
            formatSeconds,
        };
    },
};
</script>

<style scoped lang="scss">
.video-result {
    display: flex;

    .thumbnail {
        position: relative;
        margin-right: 1rem;

        width: 22.5rem;
        height: 12.5rem;

        & > img {
            width: 100%;
            height: 100%;
        }

        & > .video-length {
            position: absolute;
            bottom: 0.25rem;
            right: 0.25rem;
            padding: 0.1rem 0.2rem;

            color: white;
            background-color: rgba(black, 80%);
            border-radius: 0.1rem;

            font-size: 0.75rem;
            font-weight: 500;
        }
    }

    .video-details {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;

        & > .title {
            margin: 0.25rem 0 0;

            font-size: 1.125rem;
        }

        & > .subtitle {
            margin: 0;

            color: $gray-700;

            font-size: 0.75rem;
        }

        & > .author {
            margin: 0.5rem 0;

            display: flex;
            align-items: center;
            gap: 0.5rem;

            & > .author-avatar {
                width: 1.5rem;
                height: 1.5rem;

                border-radius: 100%;
            }

            & > .author-name {
                margin: 0;

                color: $gray-700;

                font-size: 0.75rem;

                & > a {
                    color: inherit;

                    text-decoration: none;

                    &:hover {
                        text-decoration: underline;
                    }
                }

                & > .verified {
                    margin-left: 0.25rem;

                    color: $gray-700;
                }
            }
        }

        & > .description {
            margin: 0;

            color: $gray-700;

            font-size: 0.75rem;
        }
    }
}
</style>
