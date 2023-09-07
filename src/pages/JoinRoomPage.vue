<template>
  <q-page class="flex flex-row md:flex-col items-center justify-evenly">
    <div class="flex flex-row items-center justify-center">
      <img :src="url" class="w-32 h-32" />
      <div class="text-h1">MeetBrief</div>
    </div>

    <div id="video-container"></div>

    <div class="flex flex-col gap-2">
      <q-input filled v-model="roomName" label="Room Name:" />
      <q-btn @click="joinRoom" label="Join room" class="w-64" />
      <q-btn @click="disconnectRoom" label="Disconnect room" class="w-64" />
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
  name: 'JoinRoomPage',
  components: {},
  setup() {
    let container = null as any;
    onMounted(() => {
      container = document.getElementById('video-container') as HTMLElement;
    });
    const url = '/src/assets/logo.png';

    let roomName = ref('');
    let room = ref(null) as any;

    const router = useRouter(); // Get the router instance

    const connectRoom = async (roomName: string, token: any) => {
      const newRoom = await connect(token, {
        name: roomName,
      });
      room = newRoom;
      return newRoom;
    };

    const handleConnectedParticipant = (participant: any) => {
      // create a div for this participant's tracks
      const participantDiv = document.createElement('div');
      participantDiv.setAttribute('id', participant.identity);
      container.appendChild(participantDiv);

      // iterate through the participant's published tracks and
      // call `handleTrackPublication` on them
      participant.tracks.forEach((trackPublication: any) => {
        handleTrackPublication(trackPublication, participant);
      });

      // listen for any new track publications
      participant.on('trackPublished', handleTrackPublication);
    };

    const handleTrackPublication = (
      trackPublication: any,
      participant: any
    ) => {
      function displayTrack(track: any) {
        // append this track to the participant's div and render it on the page
        const participantDiv = document.getElementById(
          participant.identity
        ) as HTMLElement;
        // track.attach creates an HTMLVideoElement or HTMLAudioElement
        // (depending on the type of track) and adds the video or audio stream
        participantDiv.append(track.attach());
      }

      // check if the trackPublication contains a `track` attribute. If it does,
      // we are subscribed to this track. If not, we are not subscribed.
      if (trackPublication.track) {
        displayTrack(trackPublication.track);
      }

      // listen for any new subscriptions to this track publication
      trackPublication.on('subscribed', displayTrack);
    };

    const handleDisconnectedParticipant = (participant: any) => {
      // stop listening for this participant
      participant.removeAllListeners();
      // remove this participant's div from the page
      const participantDiv = document.getElementById(
        participant.identity
      ) as HTMLElement;
      participantDiv.remove();
    };

    const joinRoom = async () => {
      if (!localStorage.getItem('TwilioToken')) {
        await api
          .get('/api/joinRoom', {
            params: {
              roomName: roomName.value,
            },
            headers: {
              'Content-Type': 'application/json',
              Authorization: 'Bearer ' + Cookies.get('token'),
            },
          })
          .then((response) => {
            localStorage.setItem('TwilioToken', response.data.twilioToken);
          })
          .catch((error) => {
            console.log('Error', error.response);
          });
      }

      // find or create a room with the given roomName
      const room = await connectRoom(
        roomName.value,
        localStorage.getItem('TwilioToken')
      );

      // render the local and remote participants' video and audio tracks
      handleConnectedParticipant(room.localParticipant);
      room.participants.forEach(handleConnectedParticipant);
      room.on('participantConnected', handleConnectedParticipant);

      // handle cleanup when a participant disconnects
      room.on('participantDisconnected', handleDisconnectedParticipant);
      window.addEventListener('beforeunload', () => room.disconnect());
    };

    const disconnectRoom = () => {
      room.disconnect();
      router.push('/');
    };

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
          await joinRoom();
        })
        .catch((error) => {
          console.log(error);
        });
    };

    return { url, roomName, joinRoom, disconnectRoom, createAndJoinRoom };
  },
  methods: {
    redirectToHome() {
      return this.$route.path == '/';
    },
  },
});
</script>
