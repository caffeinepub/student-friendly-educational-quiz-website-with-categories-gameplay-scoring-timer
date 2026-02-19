import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useGetTopics } from '../hooks/useQueries';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Search, BookOpen, Loader2 } from 'lucide-react';
import EduIcon from '../components/media/EduIcon';

export default function TopicBrowserPage() {
  const navigate = useNavigate();
  const { data: topics = [], isLoading } = useGetTopics();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTopics = topics.filter(([_, name]) =>
    name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header Banner */}
        <div className="relative mb-8 rounded-2xl overflow-hidden">
          <img
            src="/assets/generated/learning-banner.dim_1600x600.png"
            alt="Learning Banner"
            className="w-full h-48 md:h-64 object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent flex items-end">
            <div className="p-6 md:p-8">
              <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-2">
                Concept Clearer
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground">
                Learn with videos and AI teacher guidance
              </p>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search topics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 h-14 text-lg rounded-full border-2 focus-visible:ring-2"
            />
          </div>
        </div>

        {/* Topics Grid */}
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
          </div>
        ) : filteredTopics.length === 0 ? (
          <div className="text-center py-20">
            <BookOpen className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <p className="text-xl text-muted-foreground">
              {searchQuery ? 'No topics found' : 'No topics available yet'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTopics.map(([id, name]) => (
              <Card
                key={id}
                className="cursor-pointer hover:shadow-lg transition-all hover:scale-105 border-2"
                onClick={() => navigate({ to: '/topic/$topicId', params: { topicId: id } })}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <EduIcon icon="book" className="h-8 w-8" />
                    </div>
                    <CardTitle className="text-xl">{name}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Click to watch video and learn with AI teacher
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
