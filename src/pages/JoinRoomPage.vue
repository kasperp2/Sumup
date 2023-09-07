<template>
  <q-page class="flex flex-row md:flex-col items-center justify-center">
    <div class="flex flex-row items-center justify-center">
      <img :src="url" class="w-32 h-32" />
      <div class="text-h1">MeetBrief</div>
    </div>

    <div id="video-container"></div>

    <div class="flex flex-col gap-2 mt-10">
      <q-input
        filled
        v-model="displayName"
        label="Display Name:"
        class="beforeJoin"
      />
      <q-input
        filled
        v-model="roomName"
        label="Room Name:"
        class="beforeJoin"
      />
      <q-btn
        @click="joinRoom(roomName)"
        label="Join room"
        class="w-64 beforeJoin"
      />
      <q-btn
        @click="disconnectRoom"
        label="Disconnect"
        class="w-64 afterJoin"
        style="display: none"
      />
      <q-btn @click="createRoom" label="Create room" class="w-64 beforeJoin" />
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
  mounted() {
    const isRoomCreated = this.$route.query.joinRoom == 'true';
    const roomName = this.$route.query.roomName as string;
    if (isRoomCreated) {
      this.joinRoom(roomName);
    }
  },
  setup() {
    let container = null as any;
    let beforeJoin = null as any;
    let afterJoin = null as any;
    onMounted(() => {
      container = document.getElementById('video-container') as HTMLElement;
      beforeJoin = document.getElementsByClassName('beforeJoin');
      afterJoin = document.getElementsByClassName('afterJoin');
    });
    const url = '/src/assets/logo.png';

    let roomName = ref('');
    let displayName = ref('');
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

      for (let i = 0; i < beforeJoin.length; i++) {
        beforeJoin[i].setAttribute('style', 'display: none');
      }

      for (let i = 0; i < afterJoin.length; i++) {
        afterJoin[i].setAttribute('style', 'display: block');
      }

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

    const joinRoom = async (joinRoomName = roomName.value) => {
      if (!localStorage.getItem('TwilioToken')) {
        await api
          .get('/api/joinRoom', {
            params: {
              roomName: joinRoomName,
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
        joinRoomName,
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

    const createRoom = () => {
      router.push('/createRoom');
    };

    return {
      url,
      roomName,
      displayName,
      joinRoom,
      disconnectRoom,
      createRoom,
    };
  },
  methods: {
    redirectToHome() {
      return this.$route.path == '/';
    },
  },
});
</script>
