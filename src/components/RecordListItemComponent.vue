<template>
    <div class="row border-b-2">
      <div class="col text-xl">{{ title }}</div>
      <div class="col float-right text-right">{{ date }}</div>
    </div>
</template>

<script lang="ts">
import { defineComponent} from 'vue';



export default defineComponent({
  name: 'RecordListItemComponent',
  props: {
    title: {
      type: String,
      required: true,
    },
    date: {
      type: String,
      required: true,
    },
  },
  setup() {
    return;
  },
});
</script>
