<template>
    <div class="p-5">

        <q-input bottom-slots v-model="text" label="Search" :dense="dense" class="border border-gray-200 q-ma-lg q-px-md">

            <template v-slot:append>
                <q-icon v-if="text !== ''" name="close" @click="text = ''" class="cursor-pointer" />
                <q-icon name="search" />
            </template>
        </q-input>

        <div class="border border-gray-200 q-ma-lg q-pa-md">
            <p class="text-gray-500 float-right"> <!-- Paste date of transaction here -->
                {{ $route.params.date }}</p>
            <h2 class="text-lg font-bold">
                {{ $route.params.title }}</h2>
            <p class="text-gray-500"> <!-- Paste text data table here -->
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
                incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco
                laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate
                velit
                esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
                culpa
                qui officia deserunt mollit anim id est laborum.</p>

        </div>
        <div class="q-ma-sm q-pa-md">
            <q-btn color="red-12" label="Delete" />
        </div>

    </div>
</template>
<script lang="ts">
import { defineComponent, ref } from 'vue';

export default {
    name: 'RecordDetails',
    components: {},
    setup() {
        return {
            text: ref(''),
            ph: ref(''),
            dense: ref(false)

        }

    }
}
</script>