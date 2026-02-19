import { Card, CardContent } from '@/components/ui/card';
import type { ExternalBlob } from '../../backend';

interface NoteImagePreviewProps {
  imageBlob: ExternalBlob;
}

export default function NoteImagePreview({ imageBlob }: NoteImagePreviewProps) {
  const imageUrl = imageBlob.getDirectURL();

  return (
    <Card>
      <CardContent className="p-4">
        <p className="text-sm font-medium mb-2">Attached Image</p>
        <img
          src={imageUrl}
          alt="Note attachment"
          className="w-full rounded-lg border-2 border-border"
        />
      </CardContent>
    </Card>
  );
}
