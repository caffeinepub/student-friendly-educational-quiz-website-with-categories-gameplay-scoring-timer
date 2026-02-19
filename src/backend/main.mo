import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Text "mo:core/Text";
import Array "mo:core/Array";
import Runtime "mo:core/Runtime";
import Iter "mo:core/Iter";
import Time "mo:core/Time";
import Principal "mo:core/Principal";
import MixinStorage "blob-storage/Mixin";
import Storage "blob-storage/Storage";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";
import Migration "migration";

(with migration = Migration.run)
actor {
  include MixinStorage();
  let accessControlState = AccessControl.initState();

  include MixinAuthorization(accessControlState);

  // User Profile State
  let userProfiles = Map.empty<Principal, UserProfile>();

  public type UserProfile = {
    name : Text;
    classLevel : Level;
    subjects : [Subject];
    savedNotes : [Text];
    learningHistory : [Text];
  };

  // Exercise State
  let exercises = Map.empty<Text, Exercise>();
  var nextExerciseId = 1;

  public type Exercise = {
    id : Text;
    question : Text;
    solution : Text;
    subject : Subject;
    level : Level;
    difficulty : Difficulty;
  };

  public type Difficulty = { #easy; #medium; #hard };
  public type Level = { #elementary; #middle; #high };

  // Doubt Support State
  let doubts = Map.empty<Text, DoubtEntry>();
  var nextDoubtId = 1;

  public type DoubtStatus = {
    #not_answered;
    #in_progress;
    #answered;
  };

  public type DoubtEntry = {
    id : Text;
    owner : Principal;
    question : Text;
    solution : Text;
    status : DoubtStatus;
    timestamp : Time.Time;
    image : ?Storage.ExternalBlob;
    exerciseRef : ?Text;
  };

  // Video State
  let videos = Map.empty<Text, Video>();

  public type Video = {
    id : Text;
    name : Text;
    subject : Subject;
    level : Level;
    video : Storage.ExternalBlob;
    lesson : Storage.ExternalBlob;
    solution : Storage.ExternalBlob;
  };

  // Topic State
  let topics = Map.empty<Text, Text>();

  // Note State
  let notes = Map.empty<Text, Note>();
  var nextNoteId = 1;

  public type Note = {
    id : Text;
    owner : Principal;
    title : Text;
    content : Text;
    topicId : ?Text;
    imageId : ?Storage.ExternalBlob;
  };

  public type Subject = {
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

  // USER PROFILE OPERATIONS

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // PUBLIC QUERIES

  public query ({ caller }) func getAllTopics() : async [(Text, Text)] {
    adminOnly(caller);
    topics.toArray();
  };

  public query ({ caller }) func getAllExercises() : async [Exercise] {
    adminOnly(caller);
    valuesToArray(exercises);
  };

  func valuesToArray(map : Map.Map<Text, Exercise>) : [Exercise] {
    map.values().toArray();
  };

  public query ({ caller }) func getRelevantExercises(_subject : Subject, _level : Level) : async [Exercise] {
    usersOnly(caller);
    exercises.values().toArray().filter(func(e) { e.subject == _subject and e.level == _level });
  };

  public query ({ caller }) func getRelevantVideos(_subject : Subject, _level : Level) : async [Video] {
    usersOnly(caller);
    videos.values().toArray().filter(func(v) { v.subject == _subject and v.level == _level });
  };

  public query ({ caller }) func getNotes() : async [Note] {
    usersOnly(caller);
    if (notes.isEmpty()) { return [] };
    notes.values().toArray().filter(func(note) { note.owner == caller });
  };

  public query ({ caller }) func getDoubt(_doubtId : Text) : async DoubtEntry {
    usersOnly(caller);
    let doubt = unwrapDoubt(doubts.get(_doubtId));
    // Students can only view their own doubts, admins can view all
    if (doubt.owner != caller and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own doubts");
    };
    doubt;
  };

  public query ({ caller }) func getCallerDoubtHistory() : async [DoubtEntry] {
    usersOnly(caller);
    doubts.values().toArray().filter(func(d) { d.owner == caller });
  };

  public query ({ caller }) func getRelevantDoubts() : async [DoubtEntry] {
    adminOnly(caller);
    doubts.values().toArray().filter(func(e) { e.status != #answered });
  };

  // ADMIN OPERATIONS

  public shared ({ caller }) func createExercise(_question : Text, _solution : Text, _subject : Subject, _level : Level, _difficulty : Difficulty) : async Exercise {
    adminOnly(caller);
    let id = nextExerciseId.toText();
    nextExerciseId += 1;
    let newExercise = {
      id;
      question = _question;
      solution = _solution;
      subject = _subject;
      level = _level;
      difficulty = _difficulty;
    };
    exercises.add(id, newExercise);
    newExercise;
  };

  public shared ({ caller }) func createTopic(_id : Text, _name : Text) : async () {
    adminOnly(caller);
    topics.add(_id, _name);
  };

  public shared ({ caller }) func createVideo(_id : Text, _name : Text, _subject : Subject, _level : Level, _video : Storage.ExternalBlob, _lesson : Storage.ExternalBlob, _solution : Storage.ExternalBlob) : async () {
    adminOnly(caller);
    let newVideo = {
      id = _id;
      name = _name;
      subject = _subject;
      level = _level;
      video = _video;
      lesson = _lesson;
      solution = _solution;
    };
    videos.add(_id, newVideo);
  };

  // USER OPERATIONS

  public shared ({ caller }) func createNote(title : Text, content : Text, topicId : ?Text) : async Note {
    usersOnly(caller);
    let id = nextNoteId.toText();
    nextNoteId += 1;
    let newNote = {
      id;
      owner = caller;
      title;
      content;
      topicId;
      imageId = null;
    };
    notes.add(id, newNote);
    newNote;
  };

  public shared ({ caller }) func updateNote(id : Text, newTitle : Text, newContent : Text, newTopicId : ?Text) : async Note {
    usersOnly(caller);
    let note = unwrapNote(notes.get(id));
    verifyOwnership(caller, note.owner);
    let updatedNote = {
      note with
      title = newTitle;
      content = newContent;
      topicId = newTopicId;
    };
    notes.add(id, updatedNote);
    updatedNote;
  };

  public shared ({ caller }) func deleteNote(id : Text) : async () {
    usersOnly(caller);
    let note = unwrapNote(notes.get(id));
    verifyOwnership(caller, note.owner);
    notes.remove(id);
  };

  public shared ({ caller }) func attachImageToNote(noteId : Text, image : Storage.ExternalBlob) : async () {
    usersOnly(caller);
    let note = unwrapNote(notes.get(noteId));
    verifyOwnership(caller, note.owner);
    let updatedNote = { note with imageId = ?image };
    notes.add(noteId, updatedNote);
  };

  // Doubt operations

  public shared ({ caller }) func submitDoubt(question : Text, image : ?Storage.ExternalBlob, exerciseRef : ?Text) : async DoubtEntry {
    usersOnly(caller);
    let id = nextDoubtId.toText();
    nextDoubtId += 1;
    let newDoubt = {
      id;
      owner = caller;
      question;
      solution = "";
      status = #not_answered;
      timestamp = Time.now();
      image;
      exerciseRef;
    };
    doubts.add(id, newDoubt);
    newDoubt;
  };

  public shared ({ caller }) func answerDoubt(doubtId : Text, solution : Text, status : DoubtStatus) : async DoubtEntry {
    adminOnly(caller);
    let doubt = unwrapDoubt(doubts.get(doubtId));
    let updatedDoubt = { doubt with solution; status };
    doubts.add(doubtId, updatedDoubt);
    updatedDoubt;
  };

  // --- Utility Functions ---

  func adminOnly(caller : Principal) {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admin can access this functionality");
    };
  };

  func usersOnly(caller : Principal) {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access this functionality");
    };
  };

  func verifyOwnership(caller : Principal, owner : Principal) {
    if (caller != owner) {
      Runtime.trap("Unauthorized: You do not own this resource");
    };
  };

  func unwrapNote(option : ?Note) : Note {
    switch (option) {
      case (null) { Runtime.trap("Note does not exist") };
      case (?note) { note };
    };
  };

  func unwrapDoubt(option : ?DoubtEntry) : DoubtEntry {
    switch (option) {
      case (null) { Runtime.trap("Doubt does not exist") };
      case (?doubt) { doubt };
    };
  };
};
