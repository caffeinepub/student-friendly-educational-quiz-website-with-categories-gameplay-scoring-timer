import { createRouter, RouterProvider, createRoute, createRootRoute, Outlet } from '@tanstack/react-router';
import { ThemeProvider } from 'next-themes';
import { Toaster } from '@/components/ui/sonner';
import AppLayout from './components/layout/AppLayout';
import TopicBrowserPage from './pages/TopicBrowserPage';
import TopicLearningPage from './pages/TopicLearningPage';
import NotesPage from './pages/NotesPage';
import SettingsPage from './pages/SettingsPage';
import DoubtsPage from './pages/DoubtsPage';
import DashboardPage from './pages/DashboardPage';
import QuizPage from './pages/QuizPage';
import DailyPracticePage from './pages/DailyPracticePage';
import ReadyNotesPage from './pages/ReadyNotesPage';
import { LanguageProvider } from './state/language';
import ProfileSetupModal from './components/profile/ProfileSetupModal';

const rootRoute = createRootRoute({
  component: () => (
    <AppLayout>
      <ProfileSetupModal />
      <Outlet />
    </AppLayout>
  ),
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: DashboardPage,
});

const topicRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/topic/$topicId',
  component: TopicLearningPage,
});

const notesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/notes',
  component: NotesPage,
});

const doubtsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/doubts',
  component: DoubtsPage,
});

const dashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/dashboard',
  component: DashboardPage,
});

const quizRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/quiz',
  component: QuizPage,
});

const dailyPracticeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/daily-practice',
  component: DailyPracticePage,
});

const readyNotesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/ready-notes',
  component: ReadyNotesPage,
});

const settingsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/settings',
  component: SettingsPage,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  topicRoute,
  notesRoute,
  doubtsRoute,
  dashboardRoute,
  quizRoute,
  dailyPracticeRoute,
  readyNotesRoute,
  settingsRoute,
]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <LanguageProvider>
        <RouterProvider router={router} />
        <Toaster />
      </LanguageProvider>
    </ThemeProvider>
  );
}
