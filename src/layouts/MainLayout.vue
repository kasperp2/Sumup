<template>
  <q-layout view="lFf Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />
        <q-toolbar-title></q-toolbar-title>
      </q-toolbar>
    </q-header>

    <component to="/record" class="record-btn" :is="onRecordPage ? 'span' : 'router-link'" @click="clickRecord"/>
    <div class="bottom-bar"></div>

    <q-footer bordered class="bg-grey-3 text-primary">
      <q-tabs
        no-caps
        active-color="primary"
        indicator-color="transparent"
        class="text-grey-8"
      >
        <q-route-tab icon="home" label="home" to="/" exact/>

        <q-tab
          icon="keyboard_voice"
          label="Recorder"
          link="https://quasar.dev"
        />
      </q-tabs>
    </q-footer>

    <q-drawer v-model="leftDrawerOpen" show-if-above bordered>
      <q-list>
        <EssentialLink
          v-for="link in essentialLinks"
          :key="link.title"
          v-bind="link"
        />
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import EssentialLink from 'components/EssentialLink.vue';
import { usePageStore } from 'src/stores/page';
import { useRecorderStore } from 'src/stores/recorder';


const linksList = [
  {
    title: 'Home',
    caption: 'The starting point',
    icon: 'home',
    link: 'https://quasar.dev',
    type: 'icon',
  },
  {
    title: 'SumUps',
    caption: 'Your SumUps',
    icon: '/src/assets/logo.png',
    link: 'https://quasar.dev',
    type: 'img',
  },
  {
    title: 'About',
    caption: 'About SumUp',
    icon: 'info',
    link: 'https://quasar.dev',
    type: 'icon',
  },
];

export default defineComponent({
  name: 'MainLayout',

  components: {
    EssentialLink,
  },

  computed: {
    onRecordPage(){return this.$route.path == '/record'},
    recorder(){return useRecorderStore()},
    clickRecord(){
      if(this.onRecordPage){
        if(this.recorder.isListining){
          return this.recorder.stop
        }
        else{
          return this.recorder.start
        }
      }
      else {
        return null
      }
    }
  },

  setup() {
    const leftDrawerOpen = ref(false);
    const pageStore = usePageStore();

    useRecorderStore().createRecognition('da-DK')

    return {
      essentialLinks: linksList,
      leftDrawerOpen,
      toggleLeftDrawer() {
        leftDrawerOpen.value = !leftDrawerOpen.value;
      },
      pageStore,
    };
  },
});
</script>

<style scoped lang="scss">
// variable
$size: 100px;
$pos: 40px;
$bar-color: rgb(208,216,223);
.record-btn {
  width: $size;
  height: $size;
  position: fixed;
  bottom: 0;
  left: 50%;
  transform: translate(-50%);
  bottom: $pos;
  z-index: 2001;

  background-color: rgb(195,80,94);
  border-radius: 50%;
  border: 2px solid rgb(154, 61, 72);
  box-shadow: 0 0 0 20px $footer-color;
}

// for future o:
.bottom-bar {
  width: 100%;
  height: $pos + 40px;
  background-color: $footer-color; // TODO: bottom nav color
  position: fixed;
  bottom: 0;

  display:none;
}
</style>
