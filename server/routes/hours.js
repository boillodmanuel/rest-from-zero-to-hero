var Joi = require('Joi');
var Boom = require('Boom');
var db = require('../data/db.js');
var Collection = require('../data/collection.js');
var schemas = require('../data/schemas.js');

routes = [
  {
    method: 'GET',
    path: '/hours',
    handler: function (request, reply) {
      var offset = request.query.offset;
      var limit = request.query.limit;
      var items = db.hours.chain().sortBy('id').slice(offset, offset + limit).value();
      reply(new Collection(items, offset, limit, db.hours.size()));
    },
    config: {
      validate: {
        query: {
          offset: Joi.number().integer().min(0).max(100).default(0),
          limit: Joi.number().integer().min(1).max(100).default(10)
        }
      },
      description: 'list hours',
      notes: '<p>This method use pagination.</p>' +
      '<p>Query parameters:' +
      '<ul>' +
      '<li>offset: offset used (default 0)</li>' +
      '<li>limit: max items returned (default 10)</li></br></p>',
      tags: ['api', 'hours'],
      response: {
        schema: schemas.hours,
        status: {
          400: schemas.validationError
        }
      },
      plugins: {
        hal: {
          api: 'hours',
          query: '{?offset,limit}',
          embedded: {
            hours: {
              path: 'items',
              href: './{item.id}'
            }
          }
        }
      }
    }
  },
  {
    method: 'GET',
    path: '/hours/{id}',
    handler: function (request, reply) {
      reply(db.hours.getById(request.params.id) || Boom.notFound());
    },
    config: {
      description: 'get hour by id',
      tags: ['api', 'hours'],
      response: {
        schema: schemas.hour,
        status: {
          404: schemas.error
        }
      }
    }
  }
];

exports.routes = function (server) {
  server.route(routes);
};