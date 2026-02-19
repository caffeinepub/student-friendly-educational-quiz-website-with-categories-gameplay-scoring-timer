import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { LogIn, LogOut, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function AuthButtons() {
  const { login, clear, loginStatus, identity } = useInternetIdentity();
  const queryClient = useQueryClient();

  const isAuthenticated = !!identity;
  const isLoggingIn = loginStatus === 'logging-in';

  const handleAuth = async () => {
    if (isAuthenticated) {
      await clear();
      queryClient.clear();
      toast.success('Signed out successfully');
    } else {
      try {
        await login();
        toast.success('Signed in successfully');
      } catch (error: any) {
        console.error('Login error:', error);
        if (error.message === 'User is already authenticated') {
          await clear();
          setTimeout(() => login(), 300);
        } else {
          toast.error('Failed to sign in');
        }
      }
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="font-medium">
            {isAuthenticated ? 'Signed In' : 'Not Signed In'}
          </p>
          <p className="text-sm text-muted-foreground">
            {isAuthenticated
              ? 'Your notes are being saved'
              : 'Sign in to save your notes'}
          </p>
        </div>
        <Button
          onClick={handleAuth}
          disabled={isLoggingIn}
          variant={isAuthenticated ? 'outline' : 'default'}
          className="gap-2"
        >
          {isLoggingIn ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : isAuthenticated ? (
            <LogOut className="h-4 w-4" />
          ) : (
            <LogIn className="h-4 w-4" />
          )}
          {isLoggingIn ? 'Signing in...' : isAuthenticated ? 'Sign Out' : 'Sign In'}
        </Button>
      </div>
    </div>
  );
}
