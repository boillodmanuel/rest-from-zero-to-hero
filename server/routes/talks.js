routes = [
  {
    method: 'GET',
    path: '/talks',
    handler: function (request, reply) {
      reply([{id: "antoine"}, {id: "manu"}]);
    },
    config: {
      description: 'list talks',
      notes: 'pagination enabled',
      tags: ['talks']
    }
  },
  {
    method: 'POST',
    path: '/talks',
    handler: function (request, reply) {
      reply([{id: "antoine"}, {id: "manu"}]).code(201);
    },
    config: {
      description: 'add talks',
      tags: ['talks']
    }
  },
  {
    method: 'GET',
    path: '/talks/{id}',
    handler: function (request, reply) {
      reply({id: request.params.id});
    },
    config: {
      description: 'get speaker by id',
      tags: ['talks']
    }
  },
  {
    method: 'PUT',
    path: '/talks/{id}',
    handler: function (request, reply) {
      reply({id: request.params.id});
    },
    config: {
      description: 'update speaker',
      tags: ['talks']
    }
  },
  {
    method: 'DELETE',
    path: '/talks/{id}',
    handler: function (request, reply) {
      reply({id: request.params.id}).code(204);
    },
    config: {
      description: 'delete speaker',
      tags: ['talks']
    }
  }
];

exports.routes = function (server) {
  server.route(routes);
};