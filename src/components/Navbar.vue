<template>
    <div class="sticky top-0 z-50 bg-white py-3">
        <div class="flex justify-center container px-16 mx-auto">
            <form class="flex-grow flex max-w-2xl" @submit.prevent>
                <div
                    class="flex-grow border border-gray-300 focus-within:border-indigo-700"
                >
                    <input class="px-2 py-1 w-full focus:outline-none" />
                </div>
                <button
                    type="submit"
                    class="group border border-l-0 border-gray-300 px-2 py-1 bg-gray-50 w-16 hover:bg-gray-100 focus:bg-gray-200 focus:outline-none"
                >
                    <span
                        class="mdi mdi-magnify text-gray-500 group-hover:text-black"
                    />
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
