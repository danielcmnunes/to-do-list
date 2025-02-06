'use strict';

const Hapi = require('@hapi/hapi');
const TodoController = require('./todo/todo');
const DatabaseWrapper = require('./database/database');

const init = async () => {
    const db = new DatabaseWrapper();

    const server = Hapi.server({
        port: 3001,
        host: 'localhost',
        routes: {
            cors: {
                origin: ['*'], //nao restringir ao localhost, para poder usar a partir do exterior
                credentials: true, //TODO fix
            },
        },
    });

    server.route({
        method: 'POST',
        path: '/todos',
        handler: async (request, h) => {            
            const result = await TodoController.post(db, request.payload);

            if(result.error){
                return h.response('failed').code(400);
            } else {                    
                return h.response(result.value).code(201);
            }
        }
    });

    server.route({
        method: 'GET',
        path: '/todos',
        handler: async (request, h) => {
            const result = await TodoController.get(db, request.query);

            if(result.error){
                return h.response("failed").code(400);
            } else {                    
                return h.response(result.value).code(200);
            }
        }
    });

    server.route({
        method: 'PATCH',
        path: '/todo/{id}',
        handler: async (request, h) => {
            const result = await TodoController.edit(db, request.params, request.payload);

            if(result.error){
                return h.response('failed').code(400);
            } else {                    
                return h.response(result.value).code(200);
            }
        }
    });

    server.route({
        method: 'DELETE',
        path: '/todo/{id}',
        handler: async (request, h) => {
            const result = await TodoController.del(db, request.params);
            if(result === 1){
                return h.response([]).code(200);
            } else {
                return h.response([]).code(404);
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