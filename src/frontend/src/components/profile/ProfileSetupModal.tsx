import { useState, useEffect } from 'react';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { useGetCallerUserProfile, useSaveCallerUserProfile } from '../../hooks/useQueries';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Level, Subject } from '../../backend';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

const levelOptions = [
  { value: Level.elementary, label: 'Elementary (4th-5th)' },
  { value: Level.middle, label: 'Middle (6th-8th)' },
  { value: Level.high, label: 'High (9th-12th)' },
];

const subjectOptions = [
  { value: Subject.mathematics, label: 'Mathematics' },
  { value: Subject.physics, label: 'Physics' },
  { value: Subject.chemistry, label: 'Chemistry' },
  { value: Subject.biology, label: 'Biology' },
  { value: Subject.english, label: 'English' },
  { value: Subject.history, label: 'History' },
  { value: Subject.geography, label: 'Geography' },
  { value: Subject.social_studies, label: 'Social Studies' },
];

export default function ProfileSetupModal() {
  const { identity } = useInternetIdentity();
  const { data: userProfile, isLoading: profileLoading, isFetched } = useGetCallerUserProfile();
  const saveProfile = useSaveCallerUserProfile();

  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [classLevel, setClassLevel] = useState<Level>(Level.middle);
  const [selectedSubjects, setSelectedSubjects] = useState<Subject[]>([]);

  const isAuthenticated = !!identity;

  useEffect(() => {
    const showProfileSetup = isAuthenticated && !profileLoading && isFetched && userProfile === null;
    setOpen(showProfileSetup);
  }, [isAuthenticated, profileLoading, isFetched, userProfile]);

  const handleSubjectToggle = (subject: Subject) => {
    setSelectedSubjects((prev) =>
      prev.includes(subject) ? prev.filter((s) => s !== subject) : [...prev, subject]
    );
  };

  const handleSubmit = async () => {
    if (!name.trim()) {
      toast.error('Please enter your name');
      return;
    }
    if (selectedSubjects.length === 0) {
      toast.error('Please select at least one subject');
      return;
    }

    try {
      await saveProfile.mutateAsync({
        name: name.trim(),
        classLevel,
        subjects: selectedSubjects,
        savedNotes: [],
        learningHistory: [],
      });
      toast.success('Profile created successfully!');
      setOpen(false);
    } catch (error) {
      toast.error('Failed to create profile');
      console.error(error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[500px]" onInteractOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>Welcome! Let's set up your profile</DialogTitle>
          <DialogDescription>
            Tell us a bit about yourself to personalize your learning experience.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Your Name</Label>
            <Input
              id="name"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="class">Class Level</Label>
            <Select value={classLevel} onValueChange={(value) => setClassLevel(value as Level)}>
              <SelectTrigger id="class">
                <SelectValue placeholder="Select your class level" />
              </SelectTrigger>
              <SelectContent>
                {levelOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Subjects (select at least one)</Label>
            <div className="grid grid-cols-2 gap-3 max-h-[200px] overflow-y-auto p-2 border rounded-md">
              {subjectOptions.map((subject) => (
                <div key={subject.value} className="flex items-center space-x-2">
                  <Checkbox
                    id={subject.value}
                    checked={selectedSubjects.includes(subject.value)}
                    onCheckedChange={() => handleSubjectToggle(subject.value)}
                  />
                  <label
                    htmlFor={subject.value}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                  >
                    {subject.label}
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <Button onClick={handleSubmit} disabled={saveProfile.isPending}>
            {saveProfile.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Complete Setup
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
