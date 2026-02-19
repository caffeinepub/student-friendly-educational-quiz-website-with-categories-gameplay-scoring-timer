import { useState } from 'react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetDoubt } from '../hooks/useQueries';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { LogIn } from 'lucide-react';
import DoubtSubmissionForm from '../components/doubts/DoubtSubmissionForm';
import DoubtHistoryList from '../components/doubts/DoubtHistoryList';
import DoubtDetailView from '../components/doubts/DoubtDetailView';

export default function DoubtsPage() {
  const { identity, login } = useInternetIdentity();
  const [selectedDoubtId, setSelectedDoubtId] = useState<string | null>(null);
  const { data: selectedDoubt } = useGetDoubt(selectedDoubtId || '');

  const isAuthenticated = !!identity;

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 flex items-center justify-center p-4">
        <div className="text-center space-y-4 max-w-md">
          <h2 className="text-2xl font-bold">Sign In Required</h2>
          <p className="text-muted-foreground">
            Please sign in to submit doubts and view your doubt history.
          </p>
          <Button onClick={login} size="lg" className="gap-2">
            <LogIn className="h-5 w-5" />
            Sign In
          </Button>
        </div>
      </div>
    );
  }

  if (selectedDoubt) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <DoubtDetailView doubt={selectedDoubt} onBack={() => setSelectedDoubtId(null)} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <h1 className="text-3xl md:text-4xl font-bold mb-8">Ask Your Doubts</h1>

        <Tabs defaultValue="submit" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="submit">Submit Doubt</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>

          <TabsContent value="submit">
            <DoubtSubmissionForm />
          </TabsContent>

          <TabsContent value="history">
            <DoubtHistoryList onSelectDoubt={setSelectedDoubtId} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
