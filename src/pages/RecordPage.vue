<template>
  <div class="p-5">
    <Transition name="fall-in">
      <div v-if="recorder.isListining" class="text-h6 text-center">
        Transcribing...
      </div>
    </Transition>

    <Transition name="fall-in">
      <div v-if="recorder.current" class="m-5">
        <div class="text-h5">
          <input v-model="recorder.name" class="border-none outline-none" />
        </div>

        <div class="p-5">
          {{ recorder.current }}
        </div>
      </div>
    </Transition>

    <Transition name="fall-down">
      <div v-if="!recorder.isListining">
        <div v-if="recorder.current" class="mb-5 flex justify-around">
          <q-btn @click="recorder.clear()" rounded color="negative">clear<q-icon class="ml-2" name="backspace" /></q-btn>
          <q-btn @click="clicksave()" rounded color="positive">save<q-icon class="ml-2" name="upload" /></q-btn>
        </div>

        <q-scroll-area style="height: 500px; max-width: 100%">
          <RecordListItem @click=redirectToDetails(item.id) v-for="item in items" :key="item.id" :title="item.name"
            :date="item.createdDate" class="mb-4" />
        </q-scroll-area>
      </div>
    </Transition>s
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import RecordListItem from '/src/components/RecordListItemComponent.vue';
import { usePageStore } from 'src/stores/page';
import { useRecorderStore } from 'src/stores/recorder';
import { api } from 'boot/axios';
import { Cookies } from 'quasar';

export default defineComponent({
  name: 'RecordPage',
  components: { RecordListItem },

  setup() {
    // Change top bar title
    usePageStore().heder = 'Record';

    interface Item {
      id: number;
      name: string;
      createdDate: string;
    }

    const items = ref<Item[]>([]);

    async function clicksave() {
      await recorder.save();
      getitems();
    }
    getitems();

    function getitems() {
      api
        .get('/api/transcript', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${Cookies.get('token')}`,
          },
        })
        .then((response) => {
          items.value = response.data.transcripts;
          console.log(items.value);
        });
    }

    // TODO: onLoad function
    function onLoad() {
      console.log('load');
    }

    // AUDIO RECORDING
    const recorder = useRecorderStore();

    return {
      items,
      onLoad,
      recorder,
      clicksave,
    };
  },
  methods: {
    redirectToDetails(id: number) {
      this.$router.push({ name: 'record_details', params: { id: id } });
    }
  }
});
</script>

<style lang="scss" scoped>
.fall-down-enter-active,
.fall-down-leave-active {
  transition: all 0.5s ease-in-out;
}

.fall-down-enter-from,
.fall-down-leave-to {
  transform: translatey(200px);
  opacity: 0;
}

.fall-in-enter-active,
.fall-in-leave-active {
  transition: all 0.5s ease-in-out;
}

.fall-in-enter-from,
.fall-in-leave-to {
  transform: translatey(-100px);
  opacity: 0;
}
</style>
