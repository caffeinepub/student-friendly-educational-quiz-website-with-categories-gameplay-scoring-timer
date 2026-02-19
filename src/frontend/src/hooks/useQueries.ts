import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { Note, DoubtEntry, UserProfile, Level, Subject } from '../backend';
import { ExternalBlob } from '../backend';

export function useGetTopics() {
  const { actor, isFetching } = useActor();

  return useQuery<Array<[string, string]>>({
    queryKey: ['topics'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllTopics();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetNotes() {
  const { actor, isFetching } = useActor();

  return useQuery<Note[]>({
    queryKey: ['notes'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getNotes();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreateNote() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ title, content, topicId }: { title: string; content: string; topicId?: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createNote(title, content, topicId || null);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
    },
  });
}

export function useUpdateNote() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, title, content, topicId }: { id: string; title: string; content: string; topicId?: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateNote(id, title, content, topicId || null);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
    },
  });
}

export function useDeleteNote() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deleteNote(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
    },
  });
}

export function useAttachImageToNote() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ noteId, image }: { noteId: string; image: ExternalBlob }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.attachImageToNote(noteId, image);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
    },
  });
}

// User Profile Queries
export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<UserProfile | null>({
    queryKey: ['currentUserProfile'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

export function useSaveCallerUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error('Actor not available');
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}

// Doubt Queries
export function useSubmitDoubt() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ question, image, exerciseRef }: { question: string; image?: ExternalBlob; exerciseRef?: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.submitDoubt(question, image || null, exerciseRef || null);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['doubtHistory'] });
    },
  });
}

export function useGetDoubtHistory() {
  const { actor, isFetching } = useActor();

  return useQuery<DoubtEntry[]>({
    queryKey: ['doubtHistory'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getCallerDoubtHistory();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetDoubt(doubtId: string) {
  const { actor, isFetching } = useActor();

  return useQuery<DoubtEntry | null>({
    queryKey: ['doubt', doubtId],
    queryFn: async () => {
      if (!actor || !doubtId) return null;
      return actor.getDoubt(doubtId);
    },
    enabled: !!actor && !isFetching && !!doubtId,
  });
}

// Video and Exercise Queries
export function useGetRelevantVideos(subject: Subject, level: Level) {
  const { actor, isFetching } = useActor();

  return useQuery({
    queryKey: ['relevantVideos', subject, level],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getRelevantVideos(subject, level);
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetRelevantExercises(subject: Subject, level: Level) {
  const { actor, isFetching } = useActor();

  return useQuery({
    queryKey: ['relevantExercises', subject, level],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getRelevantExercises(subject, level);
    },
    enabled: !!actor && !isFetching,
  });
}
