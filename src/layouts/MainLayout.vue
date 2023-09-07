<template>
  <q-layout view="lFf Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-toolbar-title>{{ $route.matched[0].name }}</q-toolbar-title>
        <q-btn href="/myaccount" flat round>
          <q-avatar color="pink" text-color="white" style="cursor: pointer">{{
            username
          }}</q-avatar>
        </q-btn>
      </q-toolbar>
    </q-header>

    <q-footer bordered class="bg-grey-3 text-primary">
      <transition name="fall-down">
        <div
          v-if="showRecordBtn"
          :class="{
            'record-btn': true,
            recording: recorder.isListining,
            unavalible: true,
          }"
          @click="clickRecord"
        >
          <div
            class="sound-bar"
            v-for="(bar, i) in soundBars"
            :key="i"
            :style="{ height: bar + 'px' }"
          ></div>
        </div>
      </transition>

      <q-tabs
        no-caps
        active-color="primary"
        indicator-color="transparent"
        class="text-grey-8"
      >
        <q-route-tab icon="keyboard_voice" label="Record" to="/record" exact />

        <!-- hidden when in desktop -->
        <q-tab class="q-tab-record" disable></q-tab>

        <q-route-tab icon="videocam" label="Call" to="/JoinRoom" />
      </q-tabs>
    </q-footer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { useRecorderStore } from 'src/stores/recorder';
import { ScriptCompileContext } from 'vue/compiler-sfc';

export default defineComponent({
  name: 'MainLayout',

  components: {},

  computed: {
    showRecordBtn() {
      return ['/record'].includes(this.$route.path);
    },
    recorder() {
      return useRecorderStore();
    },
    clickRecord() {
      return this.recorder.isListining
        ? this.recorder.stop
        : this.recorder.start;
    },
  },

  setup() {
    useRecorderStore().createRecognition('da-DK');

    // type ref soundBars
    const soundBars = ref<number[]>([]);

    const resetSoundBars = () => {
      soundBars.value = [];
      for (let i = 0; i < 10; i++) {
        soundBars.value.push(0);
      }
    };

    resetSoundBars();

    navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
      const audioContext = new AudioContext();
      const analyser = audioContext.createAnalyser();
      const microphone = audioContext.createMediaStreamSource(stream);
      const scriptProcessor = audioContext.createScriptProcessor(2048, 1, 1);

      analyser.smoothingTimeConstant = 0.8;
      analyser.fftSize = 1024;

      microphone.connect(analyser);
      analyser.connect(scriptProcessor);
      scriptProcessor.connect(audioContext.destination);
      scriptProcessor.onaudioprocess = () => {
        if (!useRecorderStore().isListining) {
          resetSoundBars();
          return;
        }

        const array = new Uint8Array(analyser.frequencyBinCount);
        analyser.getByteFrequencyData(array);
        const arraySum = array.reduce((a, value) => a + value, 0);
        const average = arraySum / array.length;

        let value = Math.round(average + 2);
        value = value > 100 ? 100 : value;

        soundBars.value.push(value);
        soundBars.value.shift();
      };
    });

    return {
      soundBars,
      username: ref(
        localStorage.getItem('username')?.slice(0, 2)?.toUpperCase() ?? '?'
      ),
    };

    resetSoundBars();

    navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
      const audioContext = new AudioContext();
      const analyser = audioContext.createAnalyser();
      const microphone = audioContext.createMediaStreamSource(stream);
      const scriptProcessor = audioContext.createScriptProcessor(2048, 1, 1);

      analyser.smoothingTimeConstant = 0.8;
      analyser.fftSize = 1024;

      microphone.connect(analyser);
      analyser.connect(scriptProcessor);
      scriptProcessor.connect(audioContext.destination);
      scriptProcessor.onaudioprocess = () => {
        if (!useRecorderStore().isListining) {
          resetSoundBars();
          return;
        }

        const array = new Uint8Array(analyser.frequencyBinCount);
        analyser.getByteFrequencyData(array);
        const arraySum = array.reduce((a, value) => a + value, 0);
        const average = arraySum / array.length;

        let value = Math.round(average + 2);
        value = value > 100 ? 100 : value;

        soundBars.value.push(value);
        soundBars.value.shift();
      };
    });
  },
});
</script>

<style scoped lang="scss">
// variable
$size: 100px;
$pos: 40px;
$bar-color: rgb(208, 216, 223);
.record-btn {
  width: $size;
  height: $size;
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translate(-50%);
  bottom: $pos;
  z-index: 2001;

  background-color: rgb(195, 80, 94);
  border-radius: 50%;
  border: 2px solid rgb(154, 61, 72);
  box-shadow: 0 0 0 20px $footer-color;

  // center children vertically and horizontally
  display: flex;
  justify-content: center;
  align-items: center;

  transition: all 0.4s ease-in-out;
}

.record-btn.recording {
  width: $size + 10px;
  height: $size + 10px;
  bottom: $pos - 5px;
  box-shadow: 0 0 0 20px rgb(154, 61, 72);
}

.fall-down-enter-active,
.fall-down-leave-active {
  transition: all 0.5s ease-in-out;
}

.fall-down-enter-from,
.fall-down-leave-to {
  transform: translate(-$size/2, $size * 2);
}

.q-tab-record {
  display: none;
}
@media (min-width: 600px) {
  .q-tab-record {
    display: block;
    width: $size + 50px;
  }
}

.sound-bar {
  width: 5px;
  background-color: $bar-color;
  margin: 0 2px;
  border-radius: 2px;
  background-color: white;

  // animation
  transition: height 0.1s ease-in-out;
}
</style>
