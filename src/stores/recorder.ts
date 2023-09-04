import { defineStore } from 'pinia';
import { api } from 'boot/axios';

export const useRecorderStore = defineStore('recorder', {
  state: () => ({
    words: '',
    interim: '',
    translatedIterim: '',
    name: '',
    translated: '',
    isListining: false,
    recognition: null as webkitSpeechRecognition | null,
    error: '',
  }),
  getters: {
    current: (state) => state.words + state.interim,
    currentTranslate: (state) => state.translated + state.translatedIterim,
  },
  actions: {
    createRecognition(lang: string) {
      this.recognition = new webkitSpeechRecognition();
      this.recognition.continuous = true;
      this.recognition.lang = lang;
      this.recognition.interimResults = true;

      this.clear();

      this.recognition.onresult = (event) => {
        const current = event.resultIndex;
        const result = event.results[current];
        const transcript = result[0].transcript;

        if (result.isFinal) {
          this.interim = '';
          this.words += transcript;
          this.translate(transcript, result.isFinal);
        } else {
          this.interim = transcript;
          this.translate(transcript, result.isFinal);
        }
      };

      this.recognition.onerror = (event) => {
        if (event.error === 'no-speech') return;

        this.isListining = false;
        this.error = event.error;
      };

      // on end restart recording
      this.recognition.onend = () => {
        if (this.isListining && this.recognition != null)
          this.recognition.start();
      };
    },

    start() {
      if (this.recognition == null) return;
      this.isListining = true;
      this.recognition.start();
    },

    stop() {
      if (this.recognition == null) return;
      this.isListining = false;
      this.recognition.stop();
    },

    clear() {
      this.words = '';
      this.interim = '';
      this.name = new Date().toISOString().slice(0, 10);
    },

    async save() {
      await api.post('/api/transcript', {
        userId: 1,
        name: this.name,
        content: this.words,
      });

      this.clear();
    },

    translate(text: string, isFinal = false) {
      if (text === '') return;
      const from = 'da';
      const to = 'en';
      const apiUrl = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${from}&tl=${to}&dt=t&q=${text}`;
      fetch(apiUrl)
        .then((res) => res.json())
        .then((data) => {
          if (isFinal) {
            this.translatedIterim = '';
            this.translated += data[0][0][0];
          } else {
            this.translatedIterim = data[0][0][0];
          }
        });
    },
  },
});
