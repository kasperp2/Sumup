<template>
  <q-page class="row items-center justify-evenly">
    <q-img class="" :src="url" style="height: 140px; max-width: 150px" />
    <div class="text-h1">MeetBrief</div>
  </q-page>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'HomePage',
  components: {},
  setup() {
    const url = '/src/assets/logo.png';

    return { url };
  },
});
</script>
