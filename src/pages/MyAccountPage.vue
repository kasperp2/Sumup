<template>
  <q-page>
    <div v-if="!isLoaded" class="flex flex-col items-center mt-4">
      <q-circular-progress
        indeterminate
        rounded
        size="100px"
        color="primary"
        class="q-ma-md"
      />
      <div class="text-h5 mt-2">Loading...</div>
    </div>
    <div v-else class="flex flex-col items-center mt-4">
      <div class="text-h4">My Account</div>
      <div class="text-h5 mt-2">{{ username }}</div>
      <q-input filled v-model="email" type="email" label="Email" class="w-64" />
      <q-expansion-item
        v-model="expanded"
        icon="key"
        label="Password settings"
        class="w-64 mt-2"
      >
        <q-input
          filled
          v-model="currentPassword"
          label="Current Password"
          type="password"
          class="mt-2"
        />
        <q-input
          filled
          v-model="newPassword"
          label="New Password"
          type="password"
          class="mt-2"
        />
        <q-input
          filled
          v-model="confirmPassword"
          label="Confirm Password"
          type="password"
          class="mt-2"
        />
        <q-btn
          color="blue"
          icon-right="send"
          label="Change password"
          class="w-full mt-2"
          @click="updateInformation"
        />
      </q-expansion-item>
    </div>
  </q-page>
</template>

<script lang="ts">
import { api } from 'src/boot/axios';
import { defineComponent, ref } from 'vue';
import { Cookies, useQuasar } from 'quasar';

export default defineComponent({
  name: 'MyAccountPage',
  components: {},
  setup() {
    const $q = useQuasar();
    const isLoaded = ref(false);

    const email = ref('Doe@John.com');
    const username = ref('John Doe');
    const currentPassword = ref('');
    const newPassword = ref('');
    const confirmPassword = ref('');
    const expanded = ref(false);

    api
      .get('/api/fetchInfo', {
        headers: {
          Authorization: `Bearer ${Cookies.get('token')}`,
        },
      })
      .then((response) => {
        if (response.data.msg) {
          email.value = response.data.msg[0].email;
          username.value = response.data.msg[0].username;
          isLoaded.value = true;
          return;
        }
        $q.notify(response.data.message);
      })
      .catch((error) => {
        $q.notify(error.message);
      });

    const updateInformation = () => {
      if (email.value.trim() === '') {
        return void $q.notify('Email is empty');
      }

      // check if email is valid
      if (!email.value.includes('@') || !email.value.includes('.')) {
        return void $q.notify('Email is invalid');
      }

      if (currentPassword.value.trim() === '') {
        return void $q.notify('Current password is empty');
      }

      if (newPassword.value.trim() !== confirmPassword.value.trim()) {
        return void $q.notify('New password and confirm password do not match');
      }

      // new password is optional
      api
        .put('/api/update', {
          email: email.value,
          username: username.value,
          currentPassword: currentPassword.value,
          newPassword: newPassword.value,
          confirmPassword: confirmPassword.value,
        })
        .then((response) => {
          if (response.data.success) {
            $q.notify('Updated information');
          } else {
            $q.notify(response.data.message);
          }
        })
        .catch((error) => {
          $q.notify(error.message);
        });
    };

    return {
      email,
      username,
      currentPassword,
      newPassword,
      confirmPassword,
      expanded,
      updateInformation,
      isLoaded,
    };
  },
});
</script>
