<template>
  <q-page class="flex flex-row md:flex-col items-center justify-evenly">
    <div class="flex flex-row items-center justify-center">
      <img :src="url" class="w-32 h-32" />
      <div class="text-h1">Sumup</div>
    </div>

    <div class="flex flex-col gap-2">
      <q-input filled v-model="username" label="Username" />
      <q-input filled v-model="password" label="Password" />
      <q-btn @click="login" label="Login" class="w-64" />
    </div>
  </q-page>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { usePageStore } from 'src/stores/page';
import axios from 'axios';

export default defineComponent({
  name: 'LoginPage',
  components: {},
  setup() {
    // Change top bar title
    usePageStore().heder = 'Login';

    const url = '/src/assets/logo.png';
    let username = ref('');
    let password = ref('');

    function login() {
      console.log(username.value, password.value);
      axios
        .get('http://localhost:3000/api/login', {
          params: {
            username: username.value,
            password: password.value,
          },
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          baseURL: 'http://localhost:3000',
        })
        .then((response) => {
          console.log(response);
        });
    }

    return { url, username, password, login };
  },
});
</script>
