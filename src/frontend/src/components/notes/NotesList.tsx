import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FileText, Image } from 'lucide-react';
import type { Note } from '../../backend';

interface NotesListProps {
  notes: Note[];
  selectedNote: Note | null;
  onSelectNote: (note: Note) => void;
}

export default function NotesList({ notes, selectedNote, onSelectNote }: NotesListProps) {
  return (
    <div className="space-y-3">
      {notes.map((note) => (
        <Card
          key={note.id}
          className={`cursor-pointer transition-all hover:shadow-md ${
            selectedNote?.id === note.id ? 'border-primary border-2' : 'border-2'
          }`}
          onClick={() => onSelectNote(note)}
        >
          <CardContent className="p-4">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold truncate mb-1">{note.title || 'Untitled'}</h3>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {note.content || 'No content'}
                </p>
              </div>
              <div className="flex gap-1 flex-shrink-0">
                {note.topicId && (
                  <Badge variant="secondary" className="text-xs">
                    <FileText className="h-3 w-3 mr-1" />
                    Topic
                  </Badge>
                )}
                {note.imageId && (
                  <Badge variant="secondary" className="text-xs">
                    <Image className="h-3 w-3" />
                  </Badge>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
