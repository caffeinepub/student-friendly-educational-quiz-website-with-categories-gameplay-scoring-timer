import { useState } from 'react';
import { useGetDoubtHistory } from '../../hooks/useQueries';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Search, ChevronRight, Loader2 } from 'lucide-react';
import { DoubtStatus } from '../../backend';
import { format } from 'date-fns';

interface DoubtHistoryListProps {
  onSelectDoubt: (doubtId: string) => void;
}

export default function DoubtHistoryList({ onSelectDoubt }: DoubtHistoryListProps) {
  const { data: doubts = [], isLoading } = useGetDoubtHistory();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredDoubts = doubts.filter((doubt) =>
    doubt.question.toLowerCase().includes(searchQuery.toLowerCase())
  );

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

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Doubt History</CardTitle>
        <div className="relative mt-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search doubts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
      </CardHeader>
      <CardContent>
        {filteredDoubts.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">
            {searchQuery ? 'No doubts found' : 'No doubts submitted yet'}
          </p>
        ) : (
          <div className="space-y-2">
            {filteredDoubts.map((doubt) => (
              <Button
                key={doubt.id}
                variant="ghost"
                className="w-full justify-between h-auto py-3 px-4"
                onClick={() => onSelectDoubt(doubt.id)}
              >
                <div className="flex-1 text-left space-y-1">
                  <p className="text-sm font-medium line-clamp-2">{doubt.question}</p>
                  <div className="flex items-center gap-2">
                    <p className="text-xs text-muted-foreground">
                      {format(new Date(Number(doubt.timestamp) / 1000000), 'MMM d, yyyy')}
                    </p>
                    {getStatusBadge(doubt.status)}
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 ml-2 flex-shrink-0" />
              </Button>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
