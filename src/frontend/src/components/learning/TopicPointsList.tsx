import { useNavigate } from '@tanstack/react-router';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Circle, Plus } from 'lucide-react';

interface TopicPointsListProps {
  points: string[];
  selectedPoint: number;
  onSelectPoint: (index: number) => void;
  topicId: string;
}

export default function TopicPointsList({
  points,
  selectedPoint,
  onSelectPoint,
  topicId,
}: TopicPointsListProps) {
  const navigate = useNavigate();

  const handleCreateNote = () => {
    navigate({ to: '/notes', search: { topicId } });
  };

  return (
    <Card className="border-2">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Topic Points</CardTitle>
          <Button size="sm" variant="outline" onClick={handleCreateNote} className="gap-2">
            <Plus className="h-4 w-4" />
            Create Note
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {points.map((point, index) => (
            <button
              key={index}
              onClick={() => onSelectPoint(index)}
              className={`w-full text-left p-4 rounded-lg transition-all flex items-center gap-3 ${
                selectedPoint === index
                  ? 'bg-primary text-primary-foreground shadow-md'
                  : 'bg-muted hover:bg-muted/80'
              }`}
            >
              {selectedPoint === index ? (
                <CheckCircle2 className="h-5 w-5 flex-shrink-0" />
              ) : (
                <Circle className="h-5 w-5 flex-shrink-0" />
              )}
              <span className="font-medium">{point}</span>
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
