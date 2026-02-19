import { useState } from 'react';
import { useGetNotes } from '../hooks/useQueries';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Loader2, StickyNote } from 'lucide-react';
import NotesList from '../components/notes/NotesList';
import NoteEditor from '../components/notes/NoteEditor';
import type { Note } from '../backend';

export default function NotesPage() {
  const { identity } = useInternetIdentity();
  const { data: notes = [], isLoading } = useGetNotes();
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const handleCreateNew = () => {
    setSelectedNote(null);
    setIsCreating(true);
  };

  const handleSelectNote = (note: Note) => {
    setSelectedNote(note);
    setIsCreating(false);
  };

  const handleCloseEditor = () => {
    setSelectedNote(null);
    setIsCreating(false);
  };

  if (!identity) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 flex items-center justify-center">
        <Card className="max-w-md mx-4">
          <CardHeader>
            <CardTitle>Sign In Required</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Please sign in from Settings to create and view your notes.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-3xl md:text-4xl font-bold">My Notes</h1>
          <Button onClick={handleCreateNew} size="lg" className="gap-2">
            <Plus className="h-5 w-5" />
            New Note
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Notes List */}
          <div className="lg:col-span-1">
            {isLoading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : notes.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <StickyNote className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">No notes yet</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Create your first note to get started
                  </p>
                </CardContent>
              </Card>
            ) : (
              <NotesList
                notes={notes}
                selectedNote={selectedNote}
                onSelectNote={handleSelectNote}
              />
            )}
          </div>

          {/* Note Editor */}
          <div className="lg:col-span-2">
            {isCreating || selectedNote ? (
              <NoteEditor
                note={selectedNote}
                onClose={handleCloseEditor}
              />
            ) : (
              <Card className="h-full">
                <CardContent className="flex items-center justify-center h-full min-h-[400px]">
                  <div className="text-center">
                    <StickyNote className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-xl text-muted-foreground">
                      Select a note or create a new one
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
