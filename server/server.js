'use strict';

const Hapi = require('@hapi/hapi');
const TodoController = require('./todo/todo')
const DatabaseWrapper = require('./database/database')

const init = async () => {
    const db = new DatabaseWrapper();

    const server = Hapi.server({
        port: 3000,
        host: 'localhost'
    });

    server.route({
        method: 'GET',
        path: '/',
        handler: (request, h) => {
            return 'Hello World!';
        }
    });

    server.route({
        method: 'POST',
        path: '/todos',
        handler: async (request, h) => {
            const result = await TodoController.post(db, request.payload);

            if(result.length > 0){
                return h.response(result[0]).code(201);
            } else {
                return h.response('failed').code(400);
            }
        }
    });

    server.route({
        method: 'GET',
        path: '/todos',
        handler: async (request, h) => {
            const result = await TodoController.get(db, request.query);

            if(result.length > 0){
                return h.response(result).code(200);
            } else {
                return h.response([]).code(200);
            }
        }
    });

    server.route({
        method: 'PATCH',
        path: '/todo/{id}',
        handler: async (request, h) => {
            const result = await TodoController.edit(db, request.params, request.query);

            if(result.length > 0){
                return h.response(result).code(200);
            } else {
                return h.response([]).code(400);
            }
        }
    });

    await server.start();
    console.log('Server running on %s', server.info.uri);
};

process.on('unhandledRejection', (err) => {

    console.log(err);
    process.exit(1);
});

init();