import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetCallerUserProfile } from '../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { LogIn, BookOpen, HelpCircle, Trophy, Calendar, TrendingUp } from 'lucide-react';
import { useNavigate } from '@tanstack/react-router';

export default function DashboardPage() {
  const { identity, login } = useInternetIdentity();
  const { data: userProfile } = useGetCallerUserProfile();
  const navigate = useNavigate();

  const isAuthenticated = !!identity;

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 flex items-center justify-center p-4">
        <div className="text-center space-y-4 max-w-md">
          <h2 className="text-2xl font-bold">Welcome to Concept Notes Tutor</h2>
          <p className="text-muted-foreground">
            Your personal AI teacher for grades 4-12. Sign in to start learning!
          </p>
          <Button onClick={login} size="lg" className="gap-2">
            <LogIn className="h-5 w-5" />
            Sign In to Get Started
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            Welcome back, {userProfile?.name || 'Student'}! 👋
          </h1>
          <p className="text-muted-foreground">
            Ready to continue your learning journey?
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate({ to: '/doubts' })}>
            <CardHeader>
              <HelpCircle className="h-8 w-8 text-primary mb-2" />
              <CardTitle>Ask Doubts</CardTitle>
              <CardDescription>
                Get instant help with your questions
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate({ to: '/ready-notes' })}>
            <CardHeader>
              <BookOpen className="h-8 w-8 text-primary mb-2" />
              <CardTitle>Study Notes</CardTitle>
              <CardDescription>
                Access organized notes by subject
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate({ to: '/quiz' })}>
            <CardHeader>
              <Trophy className="h-8 w-8 text-primary mb-2" />
              <CardTitle>Take Quiz</CardTitle>
              <CardDescription>
                Test your knowledge
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate({ to: '/daily-practice' })}>
            <CardHeader>
              <Calendar className="h-8 w-8 text-primary mb-2" />
              <CardTitle>Daily Practice</CardTitle>
              <CardDescription>
                Complete today's practice questions
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate({ to: '/notes' })}>
            <CardHeader>
              <BookOpen className="h-8 w-8 text-primary mb-2" />
              <CardTitle>My Notes</CardTitle>
              <CardDescription>
                Create and manage your notes
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <TrendingUp className="h-8 w-8 text-primary mb-2" />
              <CardTitle>Progress</CardTitle>
              <CardDescription>
                Track your learning journey
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Coming soon!</p>
            </CardContent>
          </Card>
        </div>

        {userProfile && (
          <Card>
            <CardHeader>
              <CardTitle>Your Profile</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-sm">
                <span className="font-medium">Class Level:</span>{' '}
                {userProfile.classLevel === 'elementary' ? 'Elementary (4th-5th)' :
                 userProfile.classLevel === 'middle' ? 'Middle (6th-8th)' :
                 'High (9th-12th)'}
              </p>
              <p className="text-sm">
                <span className="font-medium">Subjects:</span>{' '}
                {userProfile.subjects.map(s => s.replace('_', ' ')).join(', ')}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
