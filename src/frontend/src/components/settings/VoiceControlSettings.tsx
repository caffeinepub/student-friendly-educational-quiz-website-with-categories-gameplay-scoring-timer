import { useState, useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Mic, AlertCircle, CheckCircle2 } from 'lucide-react';

const VOICE_CONTROL_KEY = 'voice-control-enabled';

export default function VoiceControlSettings() {
  const [isEnabled, setIsEnabled] = useState(false);
  const [isSupported, setIsSupported] = useState<boolean | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem(VOICE_CONTROL_KEY);
    setIsEnabled(stored === 'true');

    // Check if speech recognition is supported
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    setIsSupported(!!SpeechRecognition);
  }, []);

  const handleToggle = (checked: boolean) => {
    setIsEnabled(checked);
    localStorage.setItem(VOICE_CONTROL_KEY, checked.toString());
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <Label htmlFor="voice-control" className="flex items-center gap-2">
            <Mic className="h-4 w-4" />
            Enable Voice Control
          </Label>
          <p className="text-sm text-muted-foreground">
            Control the app using voice commands
          </p>
        </div>
        <Switch
          id="voice-control"
          checked={isEnabled}
          onCheckedChange={handleToggle}
          disabled={isSupported === false}
        />
      </div>

      {isSupported === false && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Voice control is not supported on this browser. Try using Chrome or Edge.
          </AlertDescription>
        </Alert>
      )}

      {isSupported && isEnabled && (
        <Alert>
          <CheckCircle2 className="h-4 w-4" />
          <AlertDescription>
            Voice control is active. You can use commands while learning.
          </AlertDescription>
        </Alert>
      )}

      {/* Supported Commands */}
      <Card>
        <CardContent className="pt-6">
          <h4 className="font-medium mb-3">Supported Voice Commands</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Play/Pause video:</span>
              <span className="font-medium">"play" / "pause"</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Next point:</span>
              <span className="font-medium">"next"</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Previous point:</span>
              <span className="font-medium">"previous"</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Toggle teacher:</span>
              <span className="font-medium">"teacher"</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Go to notes:</span>
              <span className="font-medium">"notes"</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
