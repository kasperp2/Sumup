<template>
  <q-page class="flex flex-row md:flex-col items-center justify-evenly">
    <div class="flex flex-row items-center justify-center">
      <img :src="url" class="w-32 h-32" />
      <div class="text-h1">MeetBrief</div>
    </div>

    <div id="video-container"></div>

    <div class="flex flex-col gap-2">
      <q-input filled v-model="roomName" label="Room Name:" />
      <q-input filled v-model="maxParticipants" label="Max Participants:" />
      <div>
        <q-checkbox left-label v-model="audioOnly" label="Audio Only" />
      </div>
      <div class="q-pa-md" style="max-width: 350px">
        <div class="q-gutter-md">
          <q-select
            outlined
            v-model="roomType"
            :options="groupTypes"
            option-value="id"
            option-label="desc"
            label="Group Type:"
            @update:model-value="maxParticipants = roomType.maxParticipants"
          />
        </div>
      </div>
      <q-btn @click="createAndJoinRoom" label="Create room" class="w-64" />
    </div>
  </q-page>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { api } from 'src/boot/axios';
import { Cookies } from 'quasar';
import { useRouter } from 'vue-router'; // Import the useRouter function

export default defineComponent({
  name: 'CreateRoomPage',
  components: {},
  setup() {
    const router = useRouter(); // Get the router instance

    const url = '/src/assets/logo.png';
    const groupTypes = [
      {
        id: 'go',
        desc: 'Go (Max 2 Participants)',
        maxParticipants: 2,
      },
      {
        id: 'peer-to-peer',
        desc: 'Peer-to-peer (Max 10 Participants)',
        maxParticipants: 10,
      },
      {
        id: 'group',
        desc: 'Group (Max 50 Participants)',
        maxParticipants: 50,
      },
      {
        id: 'group-small',
        desc: 'Group-Small (Max 4 Participants)',
        maxParticipants: 4,
      },
    ];

    let roomName = ref('');
    let roomType = ref(groupTypes[0]);
    let maxParticipants = ref(roomType.value.maxParticipants);
    let audioOnly = ref(false);

    const createAndJoinRoom = async () => {
      const meetingOptions = {
        roomName: roomName.value,
        type: roomType.value.id,
        maxParticipants: maxParticipants.value,
        audioOnly: audioOnly.value,
      };
      await api
        .post(
          '/api/createRoom',
          {
            options: meetingOptions,
          },
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: 'Bearer ' + Cookies.get('token'),
            },
          }
        )
        .then(async (response) => {
          roomName.value = response.data.room.uniqueName as string;
          router.push({
            path: '/joinRoom/',
            query: { roomName: roomName.value, joinRoom: 'true' },
          });
        })
        .catch((error) => {
          console.log(error);
        });
    };

    return {
      url,
      roomName,
      createAndJoinRoom,
      roomType,
      maxParticipants,
      groupTypes,
      audioOnly,
    };
  },
  methods: {
    redirectToHome() {
      return this.$route.path == '/';
    },
  },
});
</script>
