<template>
  <q-layout view="lFf Lpr lFf">
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import EssentialLink from 'components/EssentialLink.vue';
import { usePageStore } from 'src/stores/page';

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

  setup() {
    const pageStore = usePageStore();

    return {
      pageStore,
    };
  },
});
</script>

<style scoped lang="scss">
// variable
$size: 100px;
$pos: 40px;
$bar-color: rgb(208, 216, 223);
.record-btn {
  width: $size;
  height: $size;
  position: fixed;
  bottom: 0;
  left: 50%;
  transform: translate(-50%);
  bottom: $pos;
  z-index: 2001;

  background-color: rgb(195, 80, 94);
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

  display: none;
}
</style>
