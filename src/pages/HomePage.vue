<template>
  <!-- center container -->
<div class="container row justify-center">
  <div class="col">
    <q-img
    :src="url"
    spinner-color="white"
    style="height: 140px; max-width: 150px"
    />
  </div>
  <div class="col ">
    sumup
  </div>
</div>
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
