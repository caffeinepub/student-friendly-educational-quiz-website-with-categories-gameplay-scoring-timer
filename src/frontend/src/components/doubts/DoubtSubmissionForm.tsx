import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Camera, Mic, Send, Loader2, X } from 'lucide-react';
import { useCamera } from '../../camera/useCamera';
import { useSpeechRecognition } from '../../hooks/useSpeechRecognition';
import { useSubmitDoubt } from '../../hooks/useQueries';
import { ExternalBlob } from '../../backend';
import { toast } from 'sonner';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function DoubtSubmissionForm() {
  const [question, setQuestion] = useState('');
  const [capturedImage, setCapturedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [showCamera, setShowCamera] = useState(false);

  const submitDoubt = useSubmitDoubt();

  const {
    isActive: cameraActive,
    isSupported: cameraSupported,
    error: cameraError,
    isLoading: cameraLoading,
    startCamera,
    stopCamera,
    capturePhoto,
    videoRef,
    canvasRef,
  } = useCamera({
    facingMode: 'environment',
    quality: 0.8,
  });

  const {
    transcript,
    isListening,
    isSupported: micSupported,
    startListening,
    stopListening,
    resetTranscript,
    error: micError,
  } = useSpeechRecognition({
    language: 'en-US',
    continuous: false,
  });

  const handleCameraCapture = async () => {
    const photo = await capturePhoto();
    if (photo) {
      setCapturedImage(photo);
      setImagePreview(URL.createObjectURL(photo));
      setShowCamera(false);
      stopCamera();
      toast.success('Photo captured!');
    }
  };

  const handleStartCamera = async () => {
    setShowCamera(true);
    const success = await startCamera();
    if (!success) {
      toast.error('Failed to start camera');
      setShowCamera(false);
    }
  };

  const handleCancelCamera = () => {
    stopCamera();
    setShowCamera(false);
  };

  const handleVoiceInput = () => {
    if (isListening) {
      stopListening();
      if (transcript) {
        setQuestion((prev) => prev + ' ' + transcript);
        resetTranscript();
      }
    } else {
      startListening();
    }
  };

  const handleRemoveImage = () => {
    setCapturedImage(null);
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
      setImagePreview(null);
    }
  };

  const handleSubmit = async () => {
    if (!question.trim() && !capturedImage) {
      toast.error('Please enter a question or capture an image');
      return;
    }

    try {
      let imageBlob: ExternalBlob | undefined;
      if (capturedImage) {
        const arrayBuffer = await capturedImage.arrayBuffer();
        imageBlob = ExternalBlob.fromBytes(new Uint8Array(arrayBuffer));
      }

      await submitDoubt.mutateAsync({
        question: question.trim() || 'Image-based question',
        image: imageBlob,
      });

      toast.success('Doubt submitted successfully!');
      setQuestion('');
      handleRemoveImage();
      resetTranscript();
    } catch (error) {
      toast.error('Failed to submit doubt');
      console.error(error);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Submit Your Doubt</CardTitle>
        <CardDescription>
          Type your question, use voice input, or capture an image
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {showCamera ? (
          <div className="space-y-4">
            <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />
              <canvas ref={canvasRef} className="hidden" />
            </div>
            {cameraError && (
              <Alert variant="destructive">
                <AlertDescription>{cameraError.message}</AlertDescription>
              </Alert>
            )}
            <div className="flex gap-2">
              <Button onClick={handleCameraCapture} disabled={!cameraActive || cameraLoading} className="flex-1">
                <Camera className="mr-2 h-4 w-4" />
                Capture
              </Button>
              <Button variant="outline" onClick={handleCancelCamera}>
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <>
            <div className="space-y-2">
              <Label htmlFor="question">Your Question</Label>
              <Textarea
                id="question"
                placeholder="Describe your doubt here..."
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                rows={5}
                className="resize-none"
              />
              {transcript && (
                <p className="text-sm text-muted-foreground">
                  Voice input: {transcript}
                </p>
              )}
              {micError && (
                <Alert variant="destructive">
                  <AlertDescription>{micError}</AlertDescription>
                </Alert>
              )}
            </div>

            {imagePreview && (
              <div className="relative">
                <img
                  src={imagePreview}
                  alt="Captured"
                  className="w-full max-h-64 object-contain rounded-lg border"
                />
                <Button
                  variant="destructive"
                  size="icon"
                  className="absolute top-2 right-2"
                  onClick={handleRemoveImage}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}

            <div className="flex gap-2">
              {cameraSupported && (
                <Button
                  variant="outline"
                  onClick={handleStartCamera}
                  disabled={cameraLoading}
                  className="flex-1"
                >
                  <Camera className="mr-2 h-4 w-4" />
                  Camera
                </Button>
              )}
              {micSupported && (
                <Button
                  variant="outline"
                  onClick={handleVoiceInput}
                  disabled={!micSupported}
                  className="flex-1"
                >
                  <Mic className={`mr-2 h-4 w-4 ${isListening ? 'animate-pulse text-destructive' : ''}`} />
                  {isListening ? 'Stop' : 'Voice'}
                </Button>
              )}
            </div>

            <Button
              onClick={handleSubmit}
              disabled={submitDoubt.isPending || (!question.trim() && !capturedImage)}
              className="w-full"
            >
              {submitDoubt.isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Send className="mr-2 h-4 w-4" />
              )}
              Submit Doubt
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
}
