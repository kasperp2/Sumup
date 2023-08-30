<template>
  <q-page>
    <div class="flex flex-col items-center mt-4">
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

export default defineComponent({
  name: 'MyAccountPage',
  components: {},
  setup() {
    const email = ref('Doe@John.com');
    const username = ref('John Doe');
    const currentPassword = ref('');
    const newPassword = ref('');
    const confirmPassword = ref('');
    const expanded = ref(false);

    const updateInformation = () => {
      if (email.value.trim() === '') {
        console.log('Email is empty');
      }

      // check if email is valid
      if (!email.value.includes('@') || !email.value.includes('.')) {
        console.log('Email is invalid');
      }

      if (currentPassword.value.trim() === '') {
        console.log('Current password is empty');
      }

      if (newPassword.value.trim() !== confirmPassword.value.trim()) {
        console.log('New password and confirm password do not match');
      }

      // new password is optional
      api.post('/api/update', {
        email: email.value,
        username: username.value,
        currentPassword: currentPassword.value,
        newPassword: newPassword.value,
        confirmPassword: confirmPassword.value,
      });

      console.log('Updated information');
    };

    return {
      email,
      username,
      currentPassword,
      newPassword,
      confirmPassword,
      expanded,
      updateInformation,
    };
  },
});
</script>
