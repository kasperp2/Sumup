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
        <q-toolbar-title>{{ pageStore.heder }}</q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-footer bordered class="bg-grey-3 text-primary">
      <q-tabs
        no-caps
        active-color="primary"
        indicator-color="transparent"
        class="text-grey-8"
        v-model="tab"
      >
        <q-tab icon="home" label="home" link="https://quasar.dev" />

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

  setup() {
    const leftDrawerOpen = ref(false);
    const pageStore = usePageStore();

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
