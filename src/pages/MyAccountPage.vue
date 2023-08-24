<template>
  <q-page>
    <div class="flex flex-col items-center mt-4">
      <div class="text-h4">My Account</div>
      <div class="text-h5 mt-2">{{ username }}</div>
      <q-input filled v-model="email" label="Email" class="w-64" />
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
        />
      </q-expansion-item>
    </div>
  </q-page>
</template>

<script lang="ts">
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

    return {
      email,
      username,
      currentPassword,
      newPassword,
      confirmPassword,
      expanded,
    };
  },
});
</script>
