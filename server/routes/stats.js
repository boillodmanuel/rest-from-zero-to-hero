var Joi = require('Joi');
var Boom = require('Boom');
var db = require('../data/db.js');
var Collection = require('../data/collection.js');
var schemas = require('../data/schemas.js');
var _ = db.db._;

routes = [
  {
    method: 'GET',
    path: '/stats/notes',
    handler: function (request, reply) {
      var offset = request.query.offset;
      var limit = request.query.limit;

      var query = db.notes
          .chain();

      if (request.query.session) {
        query = query.where({ 'session': request.query.session });
      }

      query = query.reduce(function (result, note, i) {
              var statSession = result[note.session] ||
                  {
                    session: note.session,
                    min: note.value,
                    max: note.value,
                    sum: 0,
                    count: 0};
              statSession.sum += note.value;
              statSession.count++;
              statSession.min = Math.min(statSession.min, note.value);
              statSession.max = Math.max(statSession.max, note.value);
              result[note.session] = statSession;
              return result;
            }, {})
          .map(function(stat) {
            return {
                  session: stat.session,
                  count: stat.count,
                  min: stat.min,
                  max: stat.max,
                  avg: _.ceil(stat.sum / stat.count, 1)
                };
          });
      var total = query.size().value();
      var items = query.slice(offset, offset + limit).value();
      var collection = new Collection(items, offset, limit, total);
      reply(collection).code(collection.isPartial() ? 206 : 200);
    },
    config: {
      validate: {
        query: {
          offset: Joi.number().integer().min(0).max(100).default(0).description('pagination starting offset'),
          limit: Joi.number().integer().min(1).max(100).default(10).description('max items returned'),
          session: Joi.string().regex(/^s[0-9]+$/).description('session')
        }
      },
      description: 'get stats',
      tags: ['api', 'notes'],
      response: {
        schema: schemas.error,
        status: {
          200: schemas.noteStats,
          206: schemas.noteStats
        }
      },
      plugins: {
        hal: {
          api: 'notes',
          query: '{?offset,limit,session}',
          embedded: {
            notes: {
              path: 'items',
              href: '/notes/stats',
              embedded: {
                session: {
                  path: 'session',
                  href: '/sessions/{item}'
                }
              }
            }
          }
        }
      }
    }
  }
];

exports.routes = function (server) {
  server.route(routes);
};