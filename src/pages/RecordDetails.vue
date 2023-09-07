<template>
    <div class="p-5">

        <q-input bottom-slots v-model="text" label="Search" :dense="dense" class="border border-gray-200 q-ma-lg q-px-md">

            <template v-slot:append>
                <q-icon v-if="text !== ''" name="close" @click="text = ''" class="cursor-pointer" />
                <q-icon name="search" />
            </template>
        </q-input>

        <div class="border border-gray-200 q-ma-lg q-pa-md">
            <p class="text-gray-500 float-right"> {{ date }} </p>
            <h2 class="text-lg font-bold">
                {{ title }}</h2>
            <p class="text-gray-500"> <!-- Paste text data table here -->
                {{ content }}</p>

        </div>
        <div class="q-ma-sm q-pa-md">
            <q-btn color="red-12" label="Delete" />
        </div>

    </div>
</template>
<script lang="ts">
import { Cookies } from 'quasar';
import { api } from 'src/boot/axios';
import { defineComponent, ref } from 'vue';
import { useRoute } from 'vue-router';


export default {
    name: 'RecordDetails',
    setup() {
        const $route = useRoute();
        const id = ref(0)
        const title = ref("")
        const content = ref("")
        const date = ref("")
        api.get('/api/details', {
            params: {
                id: $route.params.id
            },
            method: 'GET',
            headers: {
                Authorization: `Bearer ${Cookies.get('token')}`,
            },
        })
            .then((response) => {
                const data = response.data
                console.log(data)
                id.value = data.transcripts[0].id
                title.value = data.transcripts[0].name
                content.value = data.transcripts[0].content
                date.value = data.transcripts[0].createdDate
            });

        return {
            id,
            title,
            content,
            date,
            text: ref(''),
            ph: ref(''),
            dense: ref(false)

        }

    }
}
</script>