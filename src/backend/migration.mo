import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Time "mo:core/Time";
import Principal "mo:core/Principal";
import Storage "blob-storage/Storage";

module {
  // Types from previous implementation
  type OldActor = {
    topics : Map.Map<Text, Text>;
    videos : Map.Map<Text, Storage.ExternalBlob>;
    notes : Map.Map<Text, Note>;
    nextNoteId : Nat;
  };

  type Note = {
    id : Text;
    owner : Principal;
    title : Text;
    content : Text;
    topicId : ?Text;
    imageId : ?Storage.ExternalBlob;
  };

  // New record types for extended functionalities
  type Subject = {
    #mathematics;
    #physics;
    #german;
    #english;
    #biology;
    #arts;
    #chemistry;
    #world_orientation;
    #history;
    #geography;
    #nature_in_society;
    #economy;
    #social_studies;
  };

  type Level = {
    #elementary;
    #middle;
    #high;
  };

  type Difficulty = {
    #easy;
    #medium;
    #hard;
  };

  type Exercise = {
    id : Text;
    question : Text;
    solution : Text;
    subject : Subject;
    level : Level;
    difficulty : Difficulty;
  };

  public type DoubtStatus = {
    #not_answered;
    #in_progress;
    #answered;
  };

  type DoubtEntry = {
    id : Text;
    owner : Principal;
    question : Text;
    solution : Text;
    status : DoubtStatus;
    timestamp : Time.Time;
    image : ?Storage.ExternalBlob;
    exerciseRef : ?Text;
  };

  type Video = {
    id : Text;
    name : Text;
    subject : Subject;
    level : Level;
    video : Storage.ExternalBlob;
    lesson : Storage.ExternalBlob;
    solution : Storage.ExternalBlob;
  };

  type UserProfile = {
    name : Text;
    classLevel : Level;
    subjects : [Subject];
    savedNotes : [Text];
    learningHistory : [Text];
  };

  // New extended state
  type NewActor = {
    userProfiles : Map.Map<Principal, UserProfile>;
    exercises : Map.Map<Text, Exercise>;
    nextExerciseId : Nat;
    doubts : Map.Map<Text, DoubtEntry>;
    nextDoubtId : Nat;
    videos : Map.Map<Text, Video>;
    topics : Map.Map<Text, Text>;
    notes : Map.Map<Text, Note>;
    nextNoteId : Nat;
  };

  // Migration function to convert old state to new state
  public func run(old : OldActor) : NewActor {
    {
      userProfiles = Map.empty<Principal, UserProfile>();
      exercises = Map.empty<Text, Exercise>();
      nextExerciseId = 1;
      doubts = Map.empty<Text, DoubtEntry>();
      nextDoubtId = 1;
      videos = Map.empty<Text, Video>();
      topics = old.topics;
      notes = old.notes;
      nextNoteId = old.nextNoteId;
    };
  };
};
