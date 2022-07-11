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

function removeNote(toDeleteId) {
  console.log(toDeleteId);
  fs.readFile('./db/db.json', 'utf8', (err, data) => {
    if (err) {
      console.log(err);
      return;
    } 
    let notesArray = JSON.parse(data)
    console.log(notesArray);
    for (let i = 0; i < notesArray.length; i++) {
      if (notesArray[i].id === toDeleteId) {
        notesArray.splice([i], 1);
      }
      console.log(notesArray);
    }
    fs.writeFileSync('./db/db.json', JSON.stringify(notesArray));
    return notesArray;
  })
  
};

// This nifty function comes straight from Module 11, Activites, 05-Data Persistence
// Math.floor: rounds number down to the nearest interger
// Math.random: returns a random number >= 0 and < 1
// 0x10000: 0x: prefix indicating a hexadecimal number, 10000 (hex) = 65536 (decimal)
// toString(16): converts number to string with base 16 (hexadecimal)
// substring(1): returns the substring of the original string starting at index 1 and going through the end
// result is a 4 character string with possible characters of 1-9 and a-f
function makeId() {
  let id = Math.floor((1 + Math.random()) * 0x10000)
    .toString(16)
    .substring(1);
  return id;
};

app.get('/api/notes', (req, res) => {
  try {
  const currentNotes = fs.readFileSync('./db/db.json', 'utf8');
  //console.log(currentNotes);
  //console.log(JSON.parse(currentNotes));
  res.json(JSON.parse(currentNotes));
  } catch (err) {
    res.status(400).json(err);
  } 
});

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
  req.body.id = makeId();
  const note = createNewNote(req.body);
  
  res.json(note);
  }
});

app.delete('/api/notes/:id', (req, res) => {
  const toDeleteId = (req.params.id);
  removeNote(toDeleteId);
  res.json();
});

app.listen(PORT, () => {
  console.log(`API server now on port ${PORT}.`);
});