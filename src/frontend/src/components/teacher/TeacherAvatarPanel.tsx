import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp, Play, Pause, Square } from 'lucide-react';
import { useLanguage } from '../../state/language';
import { getTeacherExplanation } from './simpleTeacherExplanations';
import { useTextToSpeech } from '../../hooks/useTextToSpeech';
import { useEffect } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface TeacherAvatarPanelProps {
  isOpen: boolean;
  onToggle: () => void;
  topicName: string;
  selectedPoint: string;
}

export default function TeacherAvatarPanel({
  isOpen,
  onToggle,
  topicName,
  selectedPoint,
}: TeacherAvatarPanelProps) {
  const { language } = useLanguage();
  const explanation = getTeacherExplanation(topicName, selectedPoint, language);

  const languageMap: Record<string, string> = {
    english: 'en-US',
    hindi: 'hi-IN',
    marathi: 'mr-IN',
  };

  const { speak, pause, resume, stop, isSpeaking, isPaused, isSupported } = useTextToSpeech({
    language: languageMap[language] || 'en-US',
    rate: 0.9,
  });

  useEffect(() => {
    if (!isOpen) {
      stop();
    }
  }, [isOpen, stop]);

  const handleSpeak = () => {
    if (isSpeaking && !isPaused) {
      pause();
    } else if (isPaused) {
      resume();
    } else {
      speak(explanation);
    }
  };

  return (
    <Card className="sticky top-6 border-2">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">AI Teacher</CardTitle>
          <Button variant="ghost" size="sm" onClick={onToggle}>
            {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
        </div>
      </CardHeader>
      {isOpen && (
        <CardContent className="space-y-4">
          {/* Avatar */}
          <div className="flex justify-center">
            <div className="relative">
              <img
                src="/assets/generated/teacher-avatar-animated.dim_256x256.png"
                alt="AI Teacher"
                className="w-32 h-32 rounded-full border-4 border-primary shadow-lg"
              />
              <div className="absolute -bottom-2 -right-2 bg-primary text-primary-foreground rounded-full p-2">
                <span className="text-2xl">👋</span>
              </div>
            </div>
          </div>

          {/* Explanation */}
          <div className="bg-muted rounded-lg p-4">
            <p className="text-sm font-medium mb-2 text-primary">
              {selectedPoint}
            </p>
            <p className="text-sm leading-relaxed">{explanation}</p>
          </div>

          {/* TTS Controls */}
          {isSupported ? (
            <div className="flex items-center justify-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleSpeak}
                disabled={!explanation}
                className="gap-2"
              >
                {isSpeaking && !isPaused ? (
                  <>
                    <Pause className="h-4 w-4" />
                    Pause
                  </>
                ) : isPaused ? (
                  <>
                    <Play className="h-4 w-4" />
                    Resume
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4" />
                    Listen
                  </>
                )}
              </Button>
              {isSpeaking && (
                <Button variant="outline" size="sm" onClick={stop} className="gap-2">
                  <Square className="h-4 w-4" />
                  Stop
                </Button>
              )}
            </div>
          ) : (
            <Alert>
              <AlertDescription className="text-xs">
                Text-to-speech is not supported in your browser.
              </AlertDescription>
            </Alert>
          )}

          {/* Language Indicator */}
          <div className="text-center text-xs text-muted-foreground">
            Teaching in: {language.charAt(0).toUpperCase() + language.slice(1)}
          </div>
        </CardContent>
      )}
    </Card>
  );
}
