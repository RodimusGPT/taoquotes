import { useEffect, useRef, useState } from 'react';
import { Audio } from 'expo-av';
import { useStore } from '../store/useStore';
import { AppState } from 'react-native';

export function useAmbientSound() {
  const soundRef = useRef<Audio.Sound | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const soundEnabled = useStore((state) => state.settings.soundEnabled);

  useEffect(() => {
    let mounted = true;

    const setupAudio = async () => {
      try {
        await Audio.setAudioModeAsync({
          playsInSilentModeIOS: true,
          staysActiveInBackground: false,
          shouldDuckAndroid: true,
        });
      } catch (error) {
        console.log('Audio mode setup skipped:', error);
      }
    };

    setupAudio();

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    const handleAppStateChange = async (nextAppState: string) => {
      if (soundRef.current) {
        if (nextAppState === 'background' || nextAppState === 'inactive') {
          await soundRef.current.pauseAsync();
        } else if (nextAppState === 'active' && soundEnabled) {
          await soundRef.current.playAsync();
        }
      }
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);
    return () => subscription.remove();
  }, [soundEnabled]);

  const playSound = async () => {
    if (!soundEnabled) return;
    try {
      // Sound files would be added to assets/sounds/
    } catch (error) {
      console.log('Sound playback not available');
    }
  };

  const stopSound = async () => {
    if (soundRef.current) {
      await soundRef.current.stopAsync();
      await soundRef.current.unloadAsync();
      soundRef.current = null;
    }
  };

  const setVolume = async (volume: number) => {
    if (soundRef.current) {
      await soundRef.current.setVolumeAsync(Math.max(0, Math.min(1, volume)));
    }
  };

  return {
    playSound,
    stopSound,
    setVolume,
    isLoaded,
  };
}
