<template>
  <q-page class="flex flex-row md:flex-col items-center justify-evenly">
    <div class="flex flex-row items-center justify-center">
      <img :src="url" class="w-32 h-32" />
      <div class="text-h1">Sumup</div>
    </div>

    <div class="flex flex-col gap-2">
      <q-input filled v-model="username" label="Username" />
      <q-input filled v-model="password" label="Password" type="password" />
      <q-btn @click="login" label="Login" class="w-64" />
    </div>
  </q-page>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { api } from 'src/boot/axios';
import { Cookies } from 'quasar';
import { useRouter } from 'vue-router'; // Import the useRouter function

export default defineComponent({
  name: 'LoginPage',
  components: {},
  setup() {
    const url = '/src/assets/logo.png';

    let username = ref('');
    let password = ref('');

    const router = useRouter(); // Get the router instance

    const login = () => {
      api
        .get('/api/login', {
          params: {
            username: username.value,
            password: password.value,
          },
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        })
        .then((response) => {
          console.log(response.data);
          Cookies.set('token', response.data.token);

          // Redirect to home page using router
          router.push('/');
        })
        .catch((error) => {
          console.log('Error', error.response);
        });
    };

    return { url, username, password, login };
  },
  methods: {
    redirectToHome() {
      return this.$route.path == '/';
    },
  },
});
</script>
