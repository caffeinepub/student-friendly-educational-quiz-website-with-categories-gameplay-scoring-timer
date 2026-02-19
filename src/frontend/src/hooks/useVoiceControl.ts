import { useEffect, useRef, useState } from 'react';
import { useNavigate } from '@tanstack/react-router';

interface VoiceControlActions {
  onPlayPause?: () => void;
  onNextPoint?: () => void;
  onPrevPoint?: () => void;
  onToggleTeacher?: () => void;
}

const VOICE_CONTROL_KEY = 'voice-control-enabled';

export function useVoiceControl(actions?: VoiceControlActions) {
  const navigate = useNavigate();
  const [isEnabled, setIsEnabled] = useState(false);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    const stored = localStorage.getItem(VOICE_CONTROL_KEY);
    setIsEnabled(stored === 'true');
  }, []);

  useEffect(() => {
    if (!isEnabled) return;

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onresult = (event: any) => {
      const last = event.results.length - 1;
      const command = event.results[last][0].transcript.toLowerCase().trim();

      // Navigation commands
      if (command.includes('notes')) {
        navigate({ to: '/notes' });
      } else if (command.includes('topics') || command.includes('home')) {
        navigate({ to: '/' });
      } else if (command.includes('settings')) {
        navigate({ to: '/settings' });
      }

      // Learning view commands
      if (actions) {
        if (command.includes('play') || command.includes('pause')) {
          actions.onPlayPause?.();
        } else if (command.includes('next')) {
          actions.onNextPoint?.();
        } else if (command.includes('previous') || command.includes('back')) {
          actions.onPrevPoint?.();
        } else if (command.includes('teacher')) {
          actions.onToggleTeacher?.();
        }
      }
    };

    recognition.onerror = (event: any) => {
      if (event.error !== 'no-speech') {
        console.error('Speech recognition error:', event.error);
      }
    };

    try {
      recognition.start();
      recognitionRef.current = recognition;
    } catch (error) {
      console.error('Failed to start speech recognition:', error);
    }

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (error) {
          // Ignore errors on cleanup
        }
      }
    };
  }, [isEnabled, actions, navigate]);

  return { isEnabled };
}
