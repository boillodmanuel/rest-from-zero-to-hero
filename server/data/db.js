var Path = require('path');
var low = require('lowdb');

var db = low(Path.join(__dirname, '../data/data.json'));
db._.mixin(require('underscore-db'));

exports = module.exports = {
  db: db,
  speakers: db('speakers'),
  sessions: db('sessions'),
  categories: db('categories'),
  hours: db('hours')
};
