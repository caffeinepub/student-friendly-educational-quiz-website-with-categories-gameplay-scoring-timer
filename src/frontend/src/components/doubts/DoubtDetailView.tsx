import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Image as ImageIcon } from 'lucide-react';
import { DoubtEntry, DoubtStatus } from '../../backend';
import { format } from 'date-fns';

interface DoubtDetailViewProps {
  doubt: DoubtEntry;
  onBack: () => void;
}

export default function DoubtDetailView({ doubt, onBack }: DoubtDetailViewProps) {
  const getStatusBadge = (status: DoubtStatus) => {
    switch (status) {
      case DoubtStatus.answered:
        return <Badge variant="default">Answered</Badge>;
      case DoubtStatus.in_progress:
        return <Badge variant="secondary">In Progress</Badge>;
      case DoubtStatus.not_answered:
        return <Badge variant="outline">Pending</Badge>;
      default:
        return null;
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <CardTitle className="flex-1">Doubt Details</CardTitle>
          {getStatusBadge(doubt.status)}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <p className="text-sm text-muted-foreground mb-2">
            Submitted on {format(new Date(Number(doubt.timestamp) / 1000000), 'MMMM d, yyyy')}
          </p>
          <h3 className="font-semibold mb-2">Question:</h3>
          <p className="text-sm leading-relaxed">{doubt.question}</p>
        </div>

        {doubt.image && (
          <div>
            <h3 className="font-semibold mb-2 flex items-center gap-2">
              <ImageIcon className="h-4 w-4" />
              Attached Image:
            </h3>
            <img
              src={doubt.image.getDirectURL()}
              alt="Doubt attachment"
              className="w-full max-h-96 object-contain rounded-lg border"
            />
          </div>
        )}

        <Separator />

        <div>
          <h3 className="font-semibold mb-2">Explanation:</h3>
          {doubt.solution ? (
            <div className="bg-muted rounded-lg p-4">
              <p className="text-sm leading-relaxed whitespace-pre-wrap">{doubt.solution}</p>
            </div>
          ) : (
            <div className="bg-muted rounded-lg p-4 text-center">
              <p className="text-sm text-muted-foreground">
                Your doubt is being reviewed. An explanation will be provided soon.
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
