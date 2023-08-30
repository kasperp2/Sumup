<template>
  <div class="p-5">
    <h3>Transcript</h3>
    {{ recorder.current }}
    <br>
    <q-btn @click="recorder.save()">post</q-btn>
    <br>
    <br>

    <q-scroll-area style="height: 500px; max-width: 100%;">
      <div>
        <RecordListItem v-for="item in items" :key="item.id" :title="item.title" :date="item.date" class="mb-4"
          @click="redirectToDetails(item.title, item.date)" />
      </div>
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

    const items = ref<Item[]>([
      { id: 1, title: 'Title-1', date: '2023-01-01' },
      { id: 2, title: 'Title 2', date: '2023-02-15' },
      { id: 3, title: 'Title 3', date: '2023-03-20' },
      { id: 4, title: 'Title 4', date: '2023-04-10' },
      { id: 5, title: 'Title 5', date: '2023-05-05' },
      { id: 6, title: 'Title 6', date: '2023-06-15' },
      { id: 7, title: 'Title 7', date: '2023-07-25' },
      { id: 8, title: 'Title 8', date: '2023-08-30' },
      { id: 9, title: 'Title 9', date: '2023-09-10' },
      { id: 10, title: 'Title 10', date: '2023-10-20' },
    ]);

    // TODO: onLoad function
    function onLoad() {
      console.log('load')
    }

    // AUDIO RECORDING
    const recorder = useRecorderStore()
    return {
      items,
      onLoad,
      recorder,
    }
  },
  methods: {
    redirectToDetails(title: string, date: string) {
      this.$router.push({ name: 'record_details', params: { title: title, date: date } });
    }
  }
});
</script>

