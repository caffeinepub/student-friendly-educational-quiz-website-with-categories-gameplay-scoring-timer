import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { LogIn, Construction } from 'lucide-react';

export default function ReadyNotesPage() {
  const { identity, login } = useInternetIdentity();
  const isAuthenticated = !!identity;

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 flex items-center justify-center p-4">
        <div className="text-center space-y-4 max-w-md">
          <h2 className="text-2xl font-bold">Sign In Required</h2>
          <p className="text-muted-foreground">
            Please sign in to access ready-made study notes.
          </p>
          <Button onClick={login} size="lg" className="gap-2">
            <LogIn className="h-5 w-5" />
            Sign In
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <h1 className="text-3xl md:text-4xl font-bold mb-8">Ready-Made Notes</h1>

        <Card>
          <CardHeader>
            <Construction className="h-12 w-12 text-muted-foreground mb-4" />
            <CardTitle>Coming Soon!</CardTitle>
            <CardDescription>
              Ready-made study notes are currently under development. Soon you'll be able to:
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
              <li>Browse notes by class level (4th-12th)</li>
              <li>Filter notes by subject</li>
              <li>Highlight important points</li>
              <li>Download notes for offline access</li>
              <li>Share notes with classmates</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
