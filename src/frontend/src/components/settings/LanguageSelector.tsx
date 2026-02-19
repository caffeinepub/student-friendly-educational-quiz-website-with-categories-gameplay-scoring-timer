import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useLanguage, type Language } from '../../state/language';

export default function LanguageSelector() {
  const { language, setLanguage } = useLanguage();

  const languages: { value: Language; label: string }[] = [
    { value: 'english', label: 'English' },
    { value: 'hindi', label: 'Hindi (हिंदी)' },
    { value: 'marathi', label: 'Marathi (मराठी)' },
  ];

  return (
    <div className="space-y-3">
      <Label htmlFor="language">Teaching Language</Label>
      <Select value={language} onValueChange={(value) => setLanguage(value as Language)}>
        <SelectTrigger id="language" className="w-full">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {languages.map((lang) => (
            <SelectItem key={lang.value} value={lang.value}>
              {lang.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <p className="text-sm text-muted-foreground">
        The AI teacher will explain concepts in your selected language
      </p>
    </div>
  );
}
