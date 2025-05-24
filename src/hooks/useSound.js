import { Howl } from 'howler';
import { useCallback } from 'react';

// Sound effects
const sounds = {
  place: new Howl({
    src: ['https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3'],
    volume: 0.5
  }),
  vanish: new Howl({
    src: ['https://assets.mixkit.co/active_storage/sfx/2570/2570-preview.mp3'],
    volume: 0.4
  }),
  win: new Howl({
    src: ['https://assets.mixkit.co/active_storage/sfx/1435/1435-preview.mp3'],
    volume: 0.6
  }),
  turn: new Howl({
    src: ['https://assets.mixkit.co/active_storage/sfx/270/270-preview.mp3'],
    volume: 0.3
  }),
  error: new Howl({
    src: ['https://assets.mixkit.co/active_storage/sfx/270/270-preview.mp3'],
    volume: 0.3
  }),
  button: new Howl({
    src: ['https://assets.mixkit.co/active_storage/sfx/270/270-preview.mp3'],
    volume: 0.2
  })
};

export const useSound = () => {
  const playSound = useCallback((soundName) => {
    try {
      if (sounds[soundName]) {
        sounds[soundName].play();
      }
    } catch (error) {
      console.error('Error playing sound:', error);
    }
  }, []);

  return { playSound };
}; 