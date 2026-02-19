import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { useGetCallerUserProfile, useSaveCallerUserProfile } from '../../hooks/useQueries';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Level, Subject } from '../../backend';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';

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

export default function ProfileSettings() {
  const { identity } = useInternetIdentity();
  const { data: userProfile, isLoading } = useGetCallerUserProfile();
  const saveProfile = useSaveCallerUserProfile();

  const [name, setName] = useState('');
  const [classLevel, setClassLevel] = useState<Level>(Level.middle);
  const [selectedSubjects, setSelectedSubjects] = useState<Subject[]>([]);

  const isAuthenticated = !!identity;

  useEffect(() => {
    if (userProfile) {
      setName(userProfile.name);
      setClassLevel(userProfile.classLevel);
      setSelectedSubjects(userProfile.subjects);
    }
  }, [userProfile]);

  const handleSubjectToggle = (subject: Subject) => {
    setSelectedSubjects((prev) =>
      prev.includes(subject) ? prev.filter((s) => s !== subject) : [...prev, subject]
    );
  };

  const handleSave = async () => {
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
        savedNotes: userProfile?.savedNotes || [],
        learningHistory: userProfile?.learningHistory || [],
      });
      toast.success('Profile updated successfully!');
    } catch (error) {
      toast.error('Failed to update profile');
      console.error(error);
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  if (!userProfile) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile Settings</CardTitle>
        <CardDescription>
          Update your learning profile and preferences
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="profile-name">Your Name</Label>
          <Input
            id="profile-name"
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="profile-class">Class Level</Label>
          <Select value={classLevel} onValueChange={(value) => setClassLevel(value as Level)}>
            <SelectTrigger id="profile-class">
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
          <Label>Subjects</Label>
          <div className="grid grid-cols-2 gap-3 max-h-[200px] overflow-y-auto p-2 border rounded-md">
            {subjectOptions.map((subject) => (
              <div key={subject.value} className="flex items-center space-x-2">
                <Checkbox
                  id={`profile-${subject.value}`}
                  checked={selectedSubjects.includes(subject.value)}
                  onCheckedChange={() => handleSubjectToggle(subject.value)}
                />
                <label
                  htmlFor={`profile-${subject.value}`}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                >
                  {subject.label}
                </label>
              </div>
            ))}
          </div>
        </div>

        <Button onClick={handleSave} disabled={saveProfile.isPending} className="w-full">
          {saveProfile.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Save Changes
        </Button>
      </CardContent>
    </Card>
  );
}
