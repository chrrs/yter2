<template>
    <div class="index-info">
        <h1 class="title">Welcome to yter2</h1>
        <p class="subtitle">
            You can search for YouTube videos and other things up top!
        </p>
    </div>
</template>

<script lang="ts">
export default {};
</script>

<style scoped lang="scss">
.index-info {
    flex-grow: 1;

    @include flexCenter();
    flex-direction: column;

    & > .title {
        margin: 1rem 0;
    }

    & > .subtitle {
        margin: 0;
    }
}
</style>
