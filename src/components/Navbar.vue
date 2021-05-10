<template>
    <div class="navbar-wrapper">
        <div class="container">
            <form class="search-form" @submit.prevent>
                <div class="input-wrapper">
                    <input placeholder="Search" />
                </div>
                <button type="submit">
                    <span class="mdi mdi-magnify" />
                </button>
            </form>
        </div>
    </div>
</template>

<script lang="ts">
export default {
    name: 'Navbar',
};
</script>

<style scoped lang="scss">
//sticky top-0 z-50 bg-white py-3
.navbar-wrapper {
    position: sticky;
    top: 0;
    left: 0;
    z-index: 50;

    background-color: white;
    padding: 0.75rem 0;

    & > .container {
        @include flexCenter();
    }

    .search-form {
        flex-grow: 1;
        max-width: 42rem;

        display: flex;
        flex-direction: row;

        & > .input-wrapper {
            flex-grow: 1;

            border: 1px solid $gray-300;

            &:focus-within {
                border-color: $indigo-500;
            }

            & > input {
                @include fontSans();

                width: 100%;
                padding: 0.4rem 0.5rem;

                border: none;
                outline: none;
                background: none;

                &::placeholder {
                    color: $gray-600;
                }
            }
        }

        & > button {
            padding: 0.4rem 1.5rem;

            border: 1px solid $gray-300;
            border-left: none;
            color: $gray-600;
            background-color: $gray-50;

            &:hover {
                color: black;
                background-color: $gray-100;
            }

            &:focus {
                background-color: $gray-200;
            }
        }
    }
}
</style>
