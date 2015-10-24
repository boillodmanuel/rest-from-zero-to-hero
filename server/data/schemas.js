//helper: https://www.npmjs.com/package/joi-machine
var Joi = require('Joi');

var speaker =
    Joi.object().keys({
      id: Joi.string().required(),
      firstname: Joi.string().required(),
      lastname: Joi.string().required()/*,
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
      }), Joi.object().keys({'class': Joi.string(), link: Joi.string()}))*/
    });

var session =
    Joi.object().keys({
      id: Joi.string().required(),
      title: Joi.string().required(),
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
    });

var error =
    Joi.object().keys({
      //TODO
    });

exports = module.exports = {
  speaker: speaker,
  session: session,
  error: error
};