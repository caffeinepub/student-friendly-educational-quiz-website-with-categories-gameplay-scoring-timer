import AppNav from '../navigation/AppNav';
import OfflineIndicator from '../common/OfflineIndicator';

interface AppLayoutProps {
  children: React.ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <OfflineIndicator />
      <AppNav />
      <main className="flex-1 pb-20 md:pb-0">{children}</main>
    </div>
  );
}
