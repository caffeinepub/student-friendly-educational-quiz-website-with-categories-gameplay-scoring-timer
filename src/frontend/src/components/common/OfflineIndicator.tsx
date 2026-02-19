import { useOfflineStorage } from '../../hooks/useOfflineStorage';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { WifiOff } from 'lucide-react';

export default function OfflineIndicator() {
  const { isOnline } = useOfflineStorage();

  if (isOnline) return null;

  return (
    <Alert variant="destructive" className="rounded-none border-x-0 border-t-0">
      <WifiOff className="h-4 w-4" />
      <AlertDescription>
        You are offline. Some features may be limited.
      </AlertDescription>
    </Alert>
  );
}
