const fs = require('fs');
const path = require('path');
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3001;
const [ notes ] = require('./db/db.json');
const { createNewNote, validateNote, removeNote, makeId } = require('./lib/notes.js');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

app.get('/api/notes', (req, res) => {
  try {
  const currentNotes = fs.readFileSync('./db/db.json', 'utf8');
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