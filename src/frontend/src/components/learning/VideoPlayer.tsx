import { useRef, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

interface VideoPlayerProps {
  url: string;
  isPlaying?: boolean;
  onPlayingChange?: (playing: boolean) => void;
}

export default function VideoPlayer({ url, isPlaying, onPlayingChange }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (!videoRef.current) return;

    if (isPlaying) {
      videoRef.current.play().catch(() => {
        onPlayingChange?.(false);
      });
    } else {
      videoRef.current.pause();
    }
  }, [isPlaying, onPlayingChange]);

  const handlePlay = () => {
    onPlayingChange?.(true);
  };

  const handlePause = () => {
    onPlayingChange?.(false);
  };

  if (!url) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>Video not available</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="relative aspect-video bg-black">
      <video
        ref={videoRef}
        src={url}
        controls
        className="w-full h-full"
        onPlay={handlePlay}
        onPause={handlePause}
        playsInline
      >
        Your browser does not support video playback.
      </video>
    </div>
  );
}
