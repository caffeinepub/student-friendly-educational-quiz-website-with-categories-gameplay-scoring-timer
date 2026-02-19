import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import AuthButtons from '../components/auth/AuthButtons';
import LanguageSelector from '../components/settings/LanguageSelector';
import VoiceControlSettings from '../components/settings/VoiceControlSettings';
import ProfileSettings from '../components/settings/ProfileSettings';

export default function SettingsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <h1 className="text-3xl md:text-4xl font-bold mb-8">Settings</h1>

        <div className="space-y-6">
          {/* Authentication */}
          <Card>
            <CardHeader>
              <CardTitle>Account</CardTitle>
              <CardDescription>
                Sign in to save your notes and track your progress
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AuthButtons />
            </CardContent>
          </Card>

          <Separator />

          {/* Profile Settings */}
          <ProfileSettings />

          <Separator />

          {/* Language */}
          <Card>
            <CardHeader>
              <CardTitle>Language</CardTitle>
              <CardDescription>
                Choose your preferred teaching language
              </CardDescription>
            </CardHeader>
            <CardContent>
              <LanguageSelector />
            </CardContent>
          </Card>

          <Separator />

          {/* Voice Control */}
          <Card>
            <CardHeader>
              <CardTitle>Voice Control</CardTitle>
              <CardDescription>
                Control the app with voice commands
              </CardDescription>
            </CardHeader>
            <CardContent>
              <VoiceControlSettings />
            </CardContent>
          </Card>

          <Separator />

          {/* Footer */}
          <div className="text-center text-sm text-muted-foreground py-8">
            <p>
              © {new Date().getFullYear()} Concept Notes Tutor
            </p>
            <p className="mt-2">
              Built with ❤️ using{' '}
              <a
                href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                caffeine.ai
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
