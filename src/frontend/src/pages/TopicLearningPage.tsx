import { useState, useEffect } from 'react';
import { useParams, useNavigate } from '@tanstack/react-router';
import { useGetTopics } from '../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, Loader2 } from 'lucide-react';
import TopicPointsList from '../components/learning/TopicPointsList';
import TeacherAvatarPanel from '../components/teacher/TeacherAvatarPanel';
import { useVoiceControl } from '../hooks/useVoiceControl';

export default function TopicLearningPage() {
  const { topicId } = useParams({ from: '/topic/$topicId' });
  const navigate = useNavigate();
  const { data: topics = [] } = useGetTopics();
  const [selectedPoint, setSelectedPoint] = useState(0);
  const [isTeacherOpen, setIsTeacherOpen] = useState(true);

  const topic = topics.find(([id]) => id === topicId);

  // Generate topic points based on topic
  const topicPoints = [
    'Introduction',
    'Key Concepts',
    'Examples',
    'Practice Problems',
    'Summary',
  ];

  // Voice control actions
  const { isEnabled: voiceEnabled } = useVoiceControl({
    onPlayPause: () => {}, // No video player currently
    onNextPoint: () => setSelectedPoint((prev) => Math.min(prev + 1, topicPoints.length - 1)),
    onPrevPoint: () => setSelectedPoint((prev) => Math.max(prev - 1, 0)),
    onToggleTeacher: () => setIsTeacherOpen((prev) => !prev),
  });

  useEffect(() => {
    if (!topic) {
      navigate({ to: '/' });
    }
  }, [topic, navigate]);

  if (!topic) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        {/* Header */}
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate({ to: '/' })}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Topics
          </Button>
          <h1 className="text-3xl md:text-4xl font-bold">{topic[1]}</h1>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Topic Points */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="overflow-hidden border-2">
              <CardContent className="p-6">
                <div className="aspect-video bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center rounded-lg">
                  <div className="text-center space-y-2">
                    <p className="text-lg font-medium text-muted-foreground">
                      Learning Topic: {topic[1]}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Select a point below to learn more
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Topic Points */}
            <TopicPointsList
              points={topicPoints}
              selectedPoint={selectedPoint}
              onSelectPoint={setSelectedPoint}
              topicId={topicId}
            />
          </div>

          {/* Teacher Panel */}
          <div className="lg:col-span-1">
            <TeacherAvatarPanel
              isOpen={isTeacherOpen}
              onToggle={() => setIsTeacherOpen(!isTeacherOpen)}
              topicName={topic[1]}
              selectedPoint={topicPoints[selectedPoint]}
            />
          </div>
        </div>

        {voiceEnabled && (
          <div className="fixed bottom-24 md:bottom-6 right-6 bg-primary text-primary-foreground px-4 py-2 rounded-full text-sm shadow-lg">
            🎤 Voice control active
          </div>
        )}
      </div>
    </div>
  );
}
