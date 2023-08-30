<template>
  <q-page class="flex flex-row md:flex-col items-center justify-evenly">
    <div class="flex flex-row items-center justify-center">
      <img :src="url" class="w-32 h-32" />
      <div class="text-h1">MeetBrief</div>
    </div>

    <div id="video-container"></div>

    <div class="flex flex-col gap-2">
      <q-input filled v-model="roomName" label="Room Name:" />
      <div class="q-pa-md">
        <q-btn-dropdown color="primary" label="Dropdown Button">
          <q-list>
            <q-item clickable v-close-popup @click="onItemClick">
              <q-item-section>
                <q-item-label>Photos</q-item-label>
              </q-item-section>
            </q-item>

            <q-item clickable v-close-popup @click="onItemClick">
              <q-item-section>
                <q-item-label>Videos</q-item-label>
              </q-item-section>
            </q-item>

            <q-item clickable v-close-popup @click="onItemClick">
              <q-item-section>
                <q-item-label>Articles</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-btn-dropdown>
      </div>
      <q-btn @click="createAndJoinRoom" label="Create room" class="w-64" />
    </div>
  </q-page>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue';
import { api } from 'src/boot/axios';
import { Cookies } from 'quasar';
import { useRouter } from 'vue-router'; // Import the useRouter function
import { connect } from 'twilio-video';

export default defineComponent({
  name: 'CreateRoomPage',
  components: {},
  setup() {
    const url = '/src/assets/logo.png';

    let roomName = ref('');

    const createAndJoinRoom = async () => {
      await api
        .post(
          '/api/createRoom',
          {
            roomname: roomName.value,
          },
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: 'Bearer ' + Cookies.get('token'),
            },
          }
        )
        .then(async (response) => {
          console.log(response);
          roomName.value = response.data.room.uniqueName as string;
          // await joinRoom();
        })
        .catch((error) => {
          console.log(error);
        });
    };

    return { url, roomName, createAndJoinRoom };
  },
  methods: {
    redirectToHome() {
      return this.$route.path == '/';
    },
  },
});
</script>
