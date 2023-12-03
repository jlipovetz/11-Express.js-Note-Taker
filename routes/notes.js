const notes = require('express').Router();
const { v4: uuidv4 } = require('uuid');
const { readAndAppend, readFromFile, writeToFile } = require('../helpers/fs.Utils');

notes.get('/', (req, res) =>
  readFromFile('./db/db.json').then((data) => res.json(JSON.parse(data)))
);

notes.post('/', (req, res) => {

  const { title, text } = req.body;


  if (title && text) {
    const newNote = {
      title,
      text,
      id: uuidv4(),
    };

    readAndAppend(newNote, './db/db.json');

    const response = {
      status: 'success',
      body: newNote,
    };

    res.json(response);
  } else {
    res.json('Error in posting feedback');
  }
});

notes.delete('/:notes_id', (req, res) => {
  const notesId = req.params.notes_id;
  console.log(notesId)
  readFromFile('./db/db.json')
    .then((data) => JSON.parse(data))
    .then((json) => {

      const result = json.filter((note) => note.id !== notesId);

      writeToFile('./db/db.json', result);

      res.json(`Item ${notesId} has been deleted 🗑️`);
    });
});


notes.get('/:notes_id', (req, res) => {
  const notesId = req.params.notes_id;
  readFromFile('./db/db.json')
    .then((data) => JSON.parse(data))
    .then((json) => {
      const result = json.filter((note) => note.notes_id === notesId);
      return result.length > 0
        ? res.json(result)
        : res.json('No note with that ID');
    });
});






module.exports = notes;