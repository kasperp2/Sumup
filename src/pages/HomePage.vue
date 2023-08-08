<template>
  <q-page class="row items-center justify-evenly">
      <q-img
      class=""
      :src="url"
      style="height: 140px; max-width: 150px"
      />
      <div class="text-h1">
        Sumup
      </div>

  </q-page>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'IndexPage',
  components: {  },
  setup() {

    const url = '/src/assets/logo.png'

    return { url };
  },
});
</script>
