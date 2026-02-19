import { useNavigate, useRouterState } from '@tanstack/react-router';
import { BookOpen, StickyNote, Settings, HelpCircle, LayoutDashboard, Trophy, Calendar, BookMarked } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';

export default function AppNav() {
  const navigate = useNavigate();
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/doubts', label: 'Doubts', icon: HelpCircle },
    { path: '/ready-notes', label: 'Notes', icon: BookMarked },
    { path: '/quiz', label: 'Quiz', icon: Trophy },
    { path: '/daily-practice', label: 'Practice', icon: Calendar },
    { path: '/notes', label: 'My Notes', icon: StickyNote },
    { path: '/settings', label: 'Settings', icon: Settings },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border md:static md:border-0 z-50">
      <div className="container mx-auto">
        <ScrollArea className="w-full">
          <div className="flex justify-start md:justify-start gap-1 md:gap-2 py-2 md:py-4 px-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPath === item.path || (item.path !== '/' && currentPath.startsWith(item.path));
              return (
                <Button
                  key={item.path}
                  variant={isActive ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => navigate({ to: item.path })}
                  className="flex-col md:flex-row h-auto md:h-9 gap-1 md:gap-2 px-3 py-2 flex-shrink-0"
                >
                  <Icon className="h-4 w-4 md:h-5 md:w-5" />
                  <span className="text-xs md:text-sm whitespace-nowrap">{item.label}</span>
                </Button>
              );
            })}
          </div>
          <ScrollBar orientation="horizontal" className="md:hidden" />
        </ScrollArea>
      </div>
    </nav>
  );
}
