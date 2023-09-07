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
      <div v-if="!isLoaded" class="flex flex-col items-center mt-4">
        <q-circular-progress indeterminate rounded size="100px" color="primary" class="q-ma-md" />
        <div class="text-h5 mt-2">Loading...</div>
      </div>
      <div v-else>
        <p class="text-gray-500" v-html="content"></p>
      </div>

    </div>
    <div class="q-ma-sm q-pa-md flex gap-2">
      <q-btn color="red-12" label="Delete" />
      <q-btn @click="summarizeText" color="green-6" label="Summarize" />
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
    const isLoaded = ref(false);


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

        id.value = data.transcripts[0].id
        title.value = data.transcripts[0].name
        content.value = data.transcripts[0].content
        date.value = data.transcripts[0].createdDate

        isLoaded.value = true;
      });

    const summarizeText = () => {
      isLoaded.value = false;
      api.get('/api/convertText', {
        params: {
          text: content.value,
          type: "summarize"
        },
        method: 'GET',
        headers: {
          Authorization: `Bearer ${Cookies.get('token')}`,
        },
      })
        .then((response) => {
          content.value = response.data.extractedTopics.replace(/\n/g, '<br>');
          isLoaded.value = true;
        }).catch((error) => {
          console.log(error)
          isLoaded.value = true;
        });
    }

    return {
      id,
      title,
      content,
      date,
      text: ref(''),
      ph: ref(''),
      dense: ref(false),
      summarizeText,
      isLoaded,
    }
  },
}
</script>
