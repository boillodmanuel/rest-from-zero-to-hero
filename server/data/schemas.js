//helper: https://www.npmjs.com/package/joi-machine
var Joi = require('Joi');

var speaker =
    Joi.object().keys({
      id: Joi.string(),
      firstname: Joi.string(),
      lastname: Joi.string(),
      topspeaker: Joi.boolean(),
      image: Joi.string(),
      category: Joi.object().keys({
        'class': Joi.string(),
        title: Joi.string()
      }),
      ribon: Joi.object().keys({
        'class': Joi.string(),
        title: Joi.string(),
        link: Joi.string(),
        tile_long: Joi.string()
      }),
      company: Joi.string(),
      about: Joi.string(),
      socials: Joi.array().items(Joi.object().keys({
        'class': Joi.string(),
        link: Joi.string()
      }), Joi.object().keys({'class': Joi.string(), link: Joi.string()}), Joi.object().keys({
        'class': Joi.string(),
        link: Joi.string()
      }), Joi.object().keys({'class': Joi.string(), link: Joi.string()}))
    }).meta({className: 'speaker'});

var updateSpeaker = speaker.requiredKeys('firstname', 'lastname');
var createSpeaker = updateSpeaker.requiredKeys('id');

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

var updateSession = session.requiredKeys('title');
var createSession = updateSession.requiredKeys('id');

var hour = Joi.object().keys({
  hourEnd: Joi.string(),
  hourStart: Joi.string(),
  id: Joi.string(),
  minEnd: Joi.string(),
  minStart: Joi.string()
});

var category = Joi.object().keys({
  id: Joi.string(),
  title: Joi.string()
});

var error =
    Joi.object().keys({
      statusCode: Joi.number().integer().required(),
      error: Joi.string().required()
    });

var validationError =
    Joi.object().keys({
      statusCode: Joi.number().integer().required(),
      error: Joi.string().required(),
      message: Joi.string(),
      validation: Joi.object().keys({keys: Joi.array().items(Joi.string(), Joi.string()), source: Joi.string()})
    });

var paginate = function (item) {
  return Joi.object().keys({
    items: Joi.array().items(item),
    size: Joi.number().integer(),
    total: Joi.number().integer(),
    offset: Joi.number().integer(),
    limit: Joi.number().integer()
  });
};

exports = module.exports = {
  //models
  speaker: speaker,
  updateSpeaker: updateSpeaker,
  createSpeaker: createSpeaker,
  speakers: paginate(speaker),
  session: session,
  updateSession: updateSession,
  createSession: createSession,
  sessions: paginate(session),
  hour: hour,
  hours: paginate(hour),
  category: category,
  categories: paginate(category),
  //error models
  error: error,
  validationError: validationError
};