import { defineStore } from 'pinia';

export const usePageStore = defineStore('page', {
  state: () => ({
    heder: 'Home',
  }),
  getters: {},
  actions: {},
});
