var Joi = require('Joi');

var speaker =
    Joi.object().keys({
      id: Joi.string(),
      firstname: Joi.string(),
      lastname: Joi.string(),
      image: Joi.string(),
      ribon: Joi.object().keys({
        'class': Joi.string(),
        title: Joi.string(),
        link: Joi.string(),
        tile_long: Joi.string()
      }),
      company: Joi.string(),
      about: Joi.string(),
      socials: Joi.array().items(
          Joi.object().keys({
            'class': Joi.string(),
            link: Joi.string()
          })
      )
    }).meta({className: 'speaker'});

var updateSpeaker = speaker.requiredKeys('firstname', 'lastname').meta({className: 'speaker_update'});
var createSpeaker = updateSpeaker.requiredKeys('id').meta({className: 'speaker_create'});

var session =
    Joi.object().keys({
      id: Joi.string(),
      title: Joi.string(),
      confRoom: Joi.string(),
      desc: Joi.string(),
      type: Joi.string(),
      difficulty: Joi.number().integer(),
      all: Joi.boolean(),
      lang: Joi.string(),
      hour: Joi.string(),
      video: Joi.binary(),
      slides: Joi.binary(),
      speakers: Joi.array().items(Joi.string())
    }).meta({className: 'session'});

var updateSession = session.requiredKeys('title').meta({className: 'session_update'});
var createSession = updateSession.requiredKeys('id').meta({className: 'session_create'});

var hour = Joi.object().keys({
  hourEnd: Joi.string(),
  hourStart: Joi.string(),
  id: Joi.string(),
  minEnd: Joi.string(),
  minStart: Joi.string()
}).meta({className: 'hour'});

var category = Joi.object().keys({
  id: Joi.string(),
  title: Joi.string()
}).meta({className: 'category'});

var error =
    Joi.object().keys({
      statusCode: Joi.number().integer().required(),
      error: Joi.string().required()
    }).meta({className: 'error'});

var validationError =
    Joi.object().keys({
      statusCode: Joi.number().integer().required(),
      error: Joi.string().required(),
      message: Joi.string(),
      validation: Joi.object().keys({
        keys: Joi.array().items(Joi.string(), Joi.string()),
        source: Joi.string()
      }).meta({className: 'validationDetail'})
    }).meta({className: 'validationError'});

var paginate = function (item, name) {
  return Joi.object().keys({
    items: Joi.array().items(item),
    size: Joi.number().integer(),
    total: Joi.number().integer(),
    offset: Joi.number().integer(),
    limit: Joi.number().integer()
  }).meta({className: name});
};

exports = module.exports = {
  //models
  speaker: speaker,
  updateSpeaker: updateSpeaker,
  createSpeaker: createSpeaker,
  speakers: paginate(speaker, 'speakers'),
  session: session,
  updateSession: updateSession,
  createSession: createSession,
  sessions: paginate(session, 'sessions'),
  hour: hour,
  hours: paginate(hour, 'hours'),
  category: category,
  categories: paginate(category, 'categories'),
  //error models
  error: error,
  validationError: validationError
};