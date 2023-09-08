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

    <div id="chat">
      <div id="chat-scroll">
        <div id="chat-content">
          <!-- chat content will be added dynamically here -->
        </div>
      </div>
      <input id="chat-input" type="text" />
    </div>
  </q-page>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue';
import { api } from 'src/boot/axios';
import { Cookies } from 'quasar';
import { useRouter } from 'vue-router'; // Import the useRouter function
import { connect } from 'twilio-video';
import { Client } from '@twilio/conversations';
import { useRecorderStore } from 'src/stores/recorder';

export default defineComponent({
  name: 'JoinRoomPage',
  components: {},
  mounted() {
    let isRoomCreated = this.$route.query.joinRoom == 'true';
    const roomName = this.$route.query.roomName as string;
    if (isRoomCreated && roomName != '') {
      this.$route.query.joinRoom = 'false';
      this.joinRoom(roomName);
    }
  },
  setup() {
    let container = null as any;
    let beforeJoin = null as any;
    let afterJoin = null as any;
    let chat = null as any;
    let conv = null as any;
    let chatScroll = null as any;
    let chatContent = null as any;
    let chatInput = null as any;
    let conversationSid = null as any;
    let recorder = null as any;
    let intervalId = null as any;
    let chatMsg = '';
    onMounted(() => {
      container = document.getElementById('video-container') as HTMLElement;
      beforeJoin = document.getElementsByClassName('beforeJoin');
      afterJoin = document.getElementsByClassName('afterJoin');
      chatScroll = document.getElementById('chat-scroll');
      chatContent = document.getElementById('chat-content');
      chatInput = document.getElementById('chat-input');
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
      // if (!localStorage.getItem('TwilioToken')) {
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
          conversationSid = response.data.conversationSid;
          // AUDIO RECORDING
          recorder = useRecorderStore();
          recorder.start();
          console.log(conversationSid);
        })
        .catch((error) => {
          console.log('Error', error.response);
        });
      // }
      // find or create a room with the given roomName
      const room = await connectRoom(
        joinRoomName,
        localStorage.getItem('TwilioToken')
      );

      // render the local and remote participants' video and audio tracks
      handleConnectedParticipant(room.localParticipant);
      room.participants.forEach(handleConnectedParticipant);
      room.on('participantConnected', handleConnectedParticipant);

      const friendlyName = joinRoomName + ' Chat';

      // handle cleanup when a participant disconnects
      room.on('participantDisconnected', handleDisconnectedParticipant);
      window.addEventListener('beforeunload', () => room.disconnect());
      connectChat(
        localStorage.getItem('TwilioToken') as string,
        friendlyName,
        room.localParticipant
      );

      // Start the continuous execution
      intervalId = setInterval(sendMessagesContinuously, intervalMilliseconds);
    };

    function connectChat(token: any, friendlyName: string, participant: any) {
      const client = new Client(token);
      const uniqueName = friendlyName.replace(/\s+/g, '-').toLowerCase();
      console.log(uniqueName);
      client.on('initialized', async () => {
        try {
          await client
            .getConversationByUniqueName(uniqueName)
            .then(async (_conv) => {
              console.log(_conv);
              conv = _conv;
              await conv.add(participant.identity);
              conv.on('messageAdded', (message) => {
                addMessageToChat(message.author, message.body);
              });
              conv.getMessages().then((messages) => {
                console.log(messages);
                chatContent.innerHTML = '';
                for (let i = 0; i < messages.items.length; i++) {
                  addMessageToChat(
                    messages.items[i].author,
                    messages.items[i].body
                  );
                }
              });
            });
        } catch (error) {
          console.log('error', error);
          try {
            await client
              .createConversation({
                friendlyName: friendlyName,
                uniqueName: uniqueName,
              })
              .then(async (_conv) => {
                console.log(_conv);
                conv = _conv;
                await conv.add(participant.identity);
                conv.on('messageAdded', (message) => {
                  addMessageToChat(message.author, message.body);
                });
                conv.getMessages().then((messages) => {
                  console.log(messages);
                  chatContent.innerHTML = '';
                  for (let i = 0; i < messages.items.length; i++) {
                    addMessageToChat(
                      messages.items[i].author,
                      messages.items[i].body
                    );
                  }
                });
              });
          } catch (error) {
            console.log('error', error);
          }
        }
      });
    }

    function addMessageToChat(user: any, message: any) {
      chatMsg = message;
      chatContent.innerHTML = `<p><b>${user}</b>: ${chatMsg}</p>`;
      chatScroll.scrollTop = chatScroll.scrollHeight;
    }

    const disconnectRoom = () => {
      room.disconnect();
      clearInterval(intervalId);
      router.push('/');
    };

    const createRoom = () => {
      router.push('/createRoom');
    };

    function sendMessagesContinuously() {
      console.log(recorder.isListining);
      if (recorder?.isListining && conv != null) {
        console.log('conv', conv);
        conv.sendMessage(recorder.current);
      }
    }

    // Specify the interval (in milliseconds) at which you want to call sendMessagesContinuously
    const intervalMilliseconds = 500; // 1000ms = 1 second

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
