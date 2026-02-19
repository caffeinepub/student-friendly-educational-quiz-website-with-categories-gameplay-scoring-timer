import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export class ExternalBlob {
    getBytes(): Promise<Uint8Array<ArrayBuffer>>;
    getDirectURL(): string;
    static fromURL(url: string): ExternalBlob;
    static fromBytes(blob: Uint8Array<ArrayBuffer>): ExternalBlob;
    withUploadProgress(onProgress: (percentage: number) => void): ExternalBlob;
}
export interface Video {
    id: string;
    subject: Subject;
    video: ExternalBlob;
    name: string;
    level: Level;
    solution: ExternalBlob;
    lesson: ExternalBlob;
}
export interface Exercise {
    id: string;
    question: string;
    subject: Subject;
    difficulty: Difficulty;
    level: Level;
    solution: string;
}
export interface UserProfile {
    subjects: Array<Subject>;
    savedNotes: Array<string>;
    name: string;
    learningHistory: Array<string>;
    classLevel: Level;
}
export type Time = bigint;
export interface DoubtEntry {
    id: string;
    status: DoubtStatus;
    question: string;
    exerciseRef?: string;
    owner: Principal;
    solution: string;
    timestamp: Time;
    image?: ExternalBlob;
}
export interface Note {
    id: string;
    title: string;
    content: string;
    owner: Principal;
    imageId?: ExternalBlob;
    topicId?: string;
}
export enum Difficulty {
    easy = "easy",
    hard = "hard",
    medium = "medium"
}
export enum DoubtStatus {
    in_progress = "in_progress",
    answered = "answered",
    not_answered = "not_answered"
}
export enum Level {
    elementary = "elementary",
    high = "high",
    middle = "middle"
}
export enum Subject {
    biology = "biology",
    nature_in_society = "nature_in_society",
    economy = "economy",
    arts = "arts",
    world_orientation = "world_orientation",
    history = "history",
    geography = "geography",
    chemistry = "chemistry",
    german = "german",
    mathematics = "mathematics",
    social_studies = "social_studies",
    physics = "physics",
    english = "english"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    answerDoubt(doubtId: string, solution: string, status: DoubtStatus): Promise<DoubtEntry>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    attachImageToNote(noteId: string, image: ExternalBlob): Promise<void>;
    createExercise(_question: string, _solution: string, _subject: Subject, _level: Level, _difficulty: Difficulty): Promise<Exercise>;
    createNote(title: string, content: string, topicId: string | null): Promise<Note>;
    createTopic(_id: string, _name: string): Promise<void>;
    createVideo(_id: string, _name: string, _subject: Subject, _level: Level, _video: ExternalBlob, _lesson: ExternalBlob, _solution: ExternalBlob): Promise<void>;
    deleteNote(id: string): Promise<void>;
    getAllExercises(): Promise<Array<Exercise>>;
    getAllTopics(): Promise<Array<[string, string]>>;
    getCallerDoubtHistory(): Promise<Array<DoubtEntry>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getDoubt(_doubtId: string): Promise<DoubtEntry>;
    getNotes(): Promise<Array<Note>>;
    getRelevantDoubts(): Promise<Array<DoubtEntry>>;
    getRelevantExercises(_subject: Subject, _level: Level): Promise<Array<Exercise>>;
    getRelevantVideos(_subject: Subject, _level: Level): Promise<Array<Video>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    submitDoubt(question: string, image: ExternalBlob | null, exerciseRef: string | null): Promise<DoubtEntry>;
    updateNote(id: string, newTitle: string, newContent: string, newTopicId: string | null): Promise<Note>;
}
