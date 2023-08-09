import { defineStore } from 'pinia';

export const usePageStore = defineStore('counter', {
  state: () => ({
    heder: 'Home',
  }),
  getters: {},
  actions: {},
});
