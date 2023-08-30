import { defineStore } from 'pinia';
import { api } from 'boot/axios'


export const useRecorderStore = defineStore('recorder', {
  state: () => ({
    words: '',
    interim: '',
    name: '',
    isListining: false,
    recognition: null as webkitSpeechRecognition | null,
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

      this.clear()

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
        if(event.error === 'no-speech') return

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
      this.recognition.start()
    },

    stop() {
      if (this.recognition == null) return
      this.isListining = false
      this.recognition.stop()
    },

    clear() {
      this.words = ''
      this.interim = ''
      this.name = new Date().toISOString().slice(0, 10)
    },

    async save() {
      await api.post('/api/transcript', {
        userId: 1,
        name: this.name,
        content: this.words,
      })

      this.clear()
    }
  },
});
