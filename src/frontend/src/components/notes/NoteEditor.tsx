import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useCreateNote, useUpdateNote, useDeleteNote, useAttachImageToNote } from '../../hooks/useQueries';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { X, Save, Trash2, Camera, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import type { Note } from '../../backend';
import CameraCaptureDialog from './CameraCaptureDialog';
import NoteImagePreview from './NoteImagePreview';
import { fileToExternalBlob } from '../../utils/fileToExternalBlob';

interface NoteEditorProps {
  note: Note | null;
  onClose: () => void;
}

export default function NoteEditor({ note, onClose }: NoteEditorProps) {
  const { identity } = useInternetIdentity();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [showCamera, setShowCamera] = useState(false);

  const createNote = useCreateNote();
  const updateNote = useUpdateNote();
  const deleteNote = useDeleteNote();
  const attachImage = useAttachImageToNote();

  useEffect(() => {
    if (note) {
      setTitle(note.title);
      setContent(note.content);
    } else {
      setTitle('');
      setContent('');
    }
  }, [note]);

  const handleSave = async () => {
    if (!identity) {
      toast.error('Please sign in to save notes');
      return;
    }

    if (!title.trim()) {
      toast.error('Please enter a title');
      return;
    }

    try {
      if (note) {
        await updateNote.mutateAsync({
          id: note.id,
          title,
          content,
          topicId: note.topicId,
        });
        toast.success('Note updated successfully');
      } else {
        await createNote.mutateAsync({ title, content });
        toast.success('Note created successfully');
        onClose();
      }
    } catch (error) {
      toast.error('Failed to save note');
    }
  };

  const handleDelete = async () => {
    if (!note || !identity) return;

    if (confirm('Are you sure you want to delete this note?')) {
      try {
        await deleteNote.mutateAsync(note.id);
        toast.success('Note deleted successfully');
        onClose();
      } catch (error) {
        toast.error('Failed to delete note');
      }
    }
  };

  const handleCapturePhoto = async (file: File) => {
    if (!note || !identity) {
      toast.error('Please save the note first before adding a photo');
      return;
    }

    try {
      const blob = await fileToExternalBlob(file);
      await attachImage.mutateAsync({ noteId: note.id, image: blob });
      toast.success('Photo attached successfully');
      setShowCamera(false);
    } catch (error) {
      toast.error('Failed to attach photo');
    }
  };

  const isSaving = createNote.isPending || updateNote.isPending;
  const isDeleting = deleteNote.isPending;

  return (
    <>
      <Card className="border-2">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>{note ? 'Edit Note' : 'New Note'}</CardTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter note title..."
              className="text-lg"
            />
          </div>

          {/* Content */}
          <div className="space-y-2">
            <Label htmlFor="content">Content</Label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your notes here..."
              rows={12}
              className="resize-none"
            />
          </div>

          {/* Image Preview */}
          {note?.imageId && <NoteImagePreview imageBlob={note.imageId} />}

          {/* Actions */}
          <div className="flex flex-wrap gap-2">
            <Button onClick={handleSave} disabled={isSaving || !identity} className="gap-2">
              {isSaving ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              Save
            </Button>

            {note && (
              <>
                <Button
                  variant="outline"
                  onClick={() => setShowCamera(true)}
                  disabled={!identity || attachImage.isPending}
                  className="gap-2"
                >
                  {attachImage.isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Camera className="h-4 w-4" />
                  )}
                  Attach Photo
                </Button>

                <Button
                  variant="destructive"
                  onClick={handleDelete}
                  disabled={isDeleting || !identity}
                  className="gap-2 ml-auto"
                >
                  {isDeleting ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Trash2 className="h-4 w-4" />
                  )}
                  Delete
                </Button>
              </>
            )}
          </div>

          {!identity && (
            <p className="text-sm text-muted-foreground">
              Please sign in from Settings to save notes
            </p>
          )}
        </CardContent>
      </Card>

      {showCamera && (
        <CameraCaptureDialog
          isOpen={showCamera}
          onClose={() => setShowCamera(false)}
          onCapture={handleCapturePhoto}
        />
      )}
    </>
  );
}
