'use strict';

const Hapi = require('@hapi/hapi');
const TodoController = require('./todo/todo')
const DatabaseWrapper = require('./database/database')
const JoiSchemas = require('./validation/joischemas')

const init = async () => {
    const db = new DatabaseWrapper();

    const server = Hapi.server({
        port: 3000,
        host: 'localhost'
    });

    server.route({
        method: 'POST',
        path: '/todos',
        handler: async (request, h) => {            
            const validation = await TodoController.post(db, request.payload);

            if(validation.error){
                return h.response('failed').code(400);
            } else {                    
                return h.response(result).code(201);
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
                return h.response(result).code(200);
            }
        }
    });

    server.route({
        method: 'PATCH',
        path: '/todo/{id}',
        handler: async (request, h) => {
            const validation = await TodoController.edit(db, request.params, request.payload);

            if(validation.error){
                return h.response('failed').code(400);
            } else {                    
                return h.response(result).code(200);
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