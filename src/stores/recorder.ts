import { log } from 'console';
import { defineStore } from 'pinia';

export const useRecorderStore = defineStore('recorder', {
  state: () => ({
    words: '',
    interim: '',
    isListining: false,
    recognition: null as SpeechRecognition | null,
    error: '',
  }),
  getters: {
    current: (state) => state.words + state.interim,
  },
  actions: {
    createRecognition(lang: string) {
      this.recognition = new webkitSpeechRecognition()
      this.recognition.continuous = true
      this.recognition.lang = lang
      this.recognition.interimResults = true

      this.recognition.onresult = (event) => {
        const current = event.resultIndex
        const result = event.results[current]
        const transcript = result[0].transcript

        if (result.isFinal){
          this.interim = ''
          this.words += transcript
        }
        else {
          this.interim = transcript
        }
      }

      this.recognition.onerror = (event) => {
        this.isListining = false
        this.error = event.error
      }

      // on end restart recording
      this.recognition.onend = () => {
        if (this.isListining && this.recognition != null) this.recognition.start()
      }
    },

    start() {
      if (this.recognition == null) return
      this.isListining = true
      console.log('start');
      this.recognition.start()
    },

    stop() {
      if (this.recognition == null) return
      this.isListining = false
      this.recognition.stop()
    }
  },
});
