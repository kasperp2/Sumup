<template>
  <q-page class="flex flex-row md:flex-col items-center justify-evenly">
    <div class="flex flex-row items-center justify-center">
      <img :src="url" class="w-32 h-32" />
      <div class="text-h1">Sumup</div>
    </div>

    <div id="video-container"></div>

    <div class="flex flex-col gap-2">
      <q-input filled v-model="roomName" label="Room Name:" />
      <q-btn @click="joinRoom" label="Join room" class="w-64" />
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
    let container = null;
    onMounted(() => {
      container = document.getElementById('video-container') as HTMLElement;
    });
    const url = '/src/assets/logo.png';

    let roomName = ref('');

    const router = useRouter(); // Get the router instance

    const connectRoom = (roomName: string, token: any) => {
      connect(token, {
        name: roomName,
      }).then((room: any) => {
        console.log(`Successfully joined a Room: ${room}`);
        room.participants.forEach((participant: any) => {
          console.log(
            `Participant "${participant.identity}" is connected to the Room`
          );
        });

        // Log your Client's LocalParticipant in the Room
        const localParticipant = room.localParticipant;
        console.log(
          `Connected to the Room as LocalParticipant "${localParticipant.identity}"`
        );
        handleConnectedParticipant(localParticipant);

        // Log any Participants already connected to the Room
        room.participants.forEach(handleConnectedParticipant);

        // Log new Participants as they connect to the Room
        room.on('participantConnected', handleConnectedParticipant);

        // Log Participants as they disconnect from the Room
        room.on('participantDisconnected', (participant: any) => {
          console.log(
            `Participant "${participant.identity}" has disconnected from the Room`
          );
        });
      });
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

    const joinRoom = () => {
      api
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
          console.log(response.data);
          localStorage.setItem('TwilioToken', response.data.twilioToken);

          // find or create a room with the given roomName
          connectRoom(roomName.value, response.data.twilioToken);
        })
        .catch((error) => {
          console.log('Error', error.response);
        });
    };

    return { url, roomName, joinRoom };
  },
  methods: {
    redirectToHome() {
      return this.$route.path == '/';
    },
  },
});
</script>
