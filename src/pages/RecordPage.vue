<template>
  <div class="p-5">
    <h3>Transcript</h3>
    {{ recorder.current }}
    <br>
    <br>

    <q-scroll-area style="height: 500px; max-width: 100%;">
      <RecordListItem
      v-for="item in items"
      :key="item.id"
      :title="item.title"
      :date="item.date"
      class="mb-4"
      />
    </q-scroll-area>
  </div>

</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import RecordListItem from '/src/components/RecordListItemComponent.vue';
import { usePageStore } from 'src/stores/page';
import { useRecorderStore } from 'src/stores/recorder';

export default defineComponent({
  name: 'RecordPage',
  components: { RecordListItem },
  setup() {
    // Change top bar title
    usePageStore().heder = 'Record';


    interface Item {
      id: number;
      title: string;
      date: string;
    }

    const items = ref<Item[]>([])

    for (let i = 0; i < 10; i++) {
      items.value.push({
        id: i,
        title: `Title ${i}`,
        date: `Date ${i}`,
      })

    }

    // TODO: onLoad function
    function onLoad() {
      console.log('load')
    }

    // AUDIO RECORDING
    const recorder = useRecorderStore()
    return {
      items,
      onLoad,
      recorder
    }
  },
});
</script>

