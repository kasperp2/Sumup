<template>
  <q-card class="flex flex-center flex-col w-auto flex-wrap">
    <q-card-section class="text-2xl">
      {{ this.title }}
      <q-separator />
    </q-card-section>

    <q-separator dark />

    <q-card-section class="text-lg">
      {{ this.caption }}
    </q-card-section>
  </q-card>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'CardComponent',
  props: {
    title: {
      type: String,
      required: true,
    },
    caption: {
      type: String,
      default: '',
    },
  },
});
</script>
