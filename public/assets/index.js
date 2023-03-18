const $noteTitle = $(".note-title");
const $noteText = $(".note-textarea");
const $saveNoteBtn = $(".save-note");
const $newNoteBtn = $(".new-note");
const $noteList = $(".list-container .list-group");

// activeNote is used to keep track of the note in the textarea
let activeNote = {};

// A function for getting all notes from the db
function getNotes() {
return $.ajax({
url: "/api/notes/",
method: "GET"
});
}

// A function for saving a note to the db
function saveNote (note) {
return $.ajax({
url: "/api/notes/",
data: note,
method: "POST"
});
}

// A function for deleting a note from the db
function deleteNote (id) {
return $.ajax({
url: "api/notes/" + id,
method: "DELETE"
});
}

// If there is an activeNote, display it, otherwise render empty inputs
function renderActiveNote() {
$saveNoteBtn.hide();

if (activeNote.id) {
$noteTitle.attr("readonly", true);
$noteText.attr("readonly", true);
$noteTitle.val(activeNote.title);
$noteText.val(activeNote.text);
} else {
$noteTitle.attr("readonly", false);
$noteText.attr("readonly", false);
$noteTitle.val("");
$noteText.val("");
}
}

// Get the note data from the inputs, save it to the db and update the view
function handleNoteSave() {
const newNote = {
title: $noteTitle.val(),
text: $noteText.val()
};

saveNote(newNote).then(() => {
getAndRenderNotes();
renderActiveNote();
});
}

// Delete the clicked note
function handleNoteDelete(event) {
// prevents the click listener for the list from being called when the button inside of it is clicked
event.stopPropagation();

const note = $(this).parent(".list-group-item").data();

if (activeNote.id === note.id) {
activeNote = {};
}

deleteNote(note.id).then(() => {
getAndRenderNotes();
renderActiveNote();
});
}

// Sets the activeNote and displays it
function handleNoteView() {
activeNote = $(this).data();
renderActiveNote();
}

// Sets the activeNote to an empty object and allows the user to enter a new note
function handleNewNoteView() {
activeNote = {};
renderActiveNote();
}

// If a note's title or text are empty, hide the save button
// Or else show it
function handleRenderSaveBtn() {
if (!$noteTitle.val().trim() || !$noteText.val().trim()) {
$saveNoteBtn.hide();
} else {
$saveNoteBtn.show();
}
}

// Render the list of note titles
function renderNoteList(notes) {
$noteList.empty();
const noteListItems = [];

for (let i = 0; i < notes.length; i++) {
const note = notes[i];
const $li = $("<li class='list-group-item'>").data(note);
const $span = $("<span>").text(note.title);
const $delBtn = $("<i class='fas fa-trash-alt float-right text-danger delete-note'>");

$li.append($span, $delBtn);
noteListItems.push($li);
}

$noteList.append(noteListItems);
}

// Gets notes from the db and renders them to the sidebar
function getAndRenderNotes();