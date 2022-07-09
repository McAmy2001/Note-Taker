const fs = require('fs');
const path = require('path');
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3001;
const { notes } = require('./db/db.json');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

function createNewNote(body) {
  const currentNotes = fs.readFileSync('./db/db.json', 'utf8');

  const note = body;
  const currentNotesArray = [];
  const concatNotesArray = currentNotesArray.concat(JSON.parse(currentNotes)); 
  let addingNewNote = [...concatNotesArray, note];
  fs.writeFileSync('./db/db.json', JSON.stringify(addingNewNote));
  console.log(concatNotesArray);
  return note;
};
function validateNote(note) {
  if (!note.title || typeof note.title !== 'string') {
    return false;
  }
  if (!note.text || typeof note.text !== 'string') {
    return false;
  }
  return true;
};

app.get('/api/notes', (req, res) => {
  try {
  const currentNotes = fs.readFileSync('./db/db.json', 'utf8');
  console.log(currentNotes);
  console.log(JSON.parse(currentNotes));
  res.json(JSON.parse(currentNotes));
  } catch (err) {
    res.status(400).json(err);
  } 
});

//app.get('/api/notes/:id', (req, res) => {
//  const result = (req.params.id, notes);
//  res.json(result);
//}

app.get('/', (req,res) => {
  res.sendFile(path.join(__dirname, './public/index.html'));
});

app.get('/notes', (req, res) => {
  res.sendFile(path.join(__dirname, './public/notes.html'));
});

app.get('*', (req,res) => {
  res.sendFile(path.join(__dirname, './public/index.html'));
});

app.post('/api/notes', (req, res) => {
  if (!validateNote(req.body)) {
    res.status(400).send('The note is not properly formatted.');
  } else {
  const note = createNewNote(req.body);
  res.json(note);
  }
});

app.listen(PORT, () => {
  console.log(`API server now on port ${PORT}.`);
});