<template>
    <img ref="img" v-bind="$attrs" />
</template>

<script>
import { onMounted, ref, toRefs } from 'vue';

export default {
    name: 'LazyImage',
    props: {
        src: {
            type: String,
            required: true,
        },
    },
    setup(props) {
        const img = ref(null);
        const { src } = toRefs(props);
        const observer = ref(null);

        const load = () => {
            window.requestAnimationFrame(() => {
                Object.assign(img.value, { src: src.value });
            });
        };

        const unobserve = () => {
            if (observer.value) {
                observer.value.unobserve(img.value);
            }
        };

        const observe = () => {
            if ('IntersectionObserver' in window) {
                observer.value = new IntersectionObserver((entries) => {
                    entries.forEach((entry) => {
                        if (entry.isIntersecting) {
                            load();
                            unobserve();
                        }
                    });
                });

                observer.value.observe(img.value);
            } else {
                load();
            }
        };

        onMounted(() => {
            observe();
        });

        return {
            img,
        };
    },
};
</script>

<style scoped></style>
