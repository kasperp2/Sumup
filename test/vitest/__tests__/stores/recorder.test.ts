import { installQuasarPlugin } from '@quasar/quasar-app-extension-testing-unit-vitest';
import { describe, expect, it, beforeEach } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { useRecorderStore } from 'src/stores/recorder';

installQuasarPlugin();

describe('Recorder store', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it('should clear words and set name', () => {
    const store = useRecorderStore();
    store.clear();

    expect(store.interim).toBe('');
    expect(store.words).toBe('');
    expect(store.name).toBe('');
  });
});
