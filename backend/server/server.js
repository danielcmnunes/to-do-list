'use strict';

const Jwt = require('@hapi/jwt');
const Hapi = require('@hapi/hapi');
const TodoController = require('./todo/todo');
const AuthController = require('./auth/authcontroller');
const DatabaseWrapper = require('./database/database');

const init = async () => {
    const db = new DatabaseWrapper();

    const server = Hapi.server({
        port: 3001,
        host: 'localhost',
        routes: {
            cors: {
                origin: ['*'], //nao restringir ao localhost, para poder usar a partir do exterior
                // credentials: true, //TODO fix
            },
        },
    });

    await server.register(Jwt);
    server.auth.strategy('todo_list_jwt_strategy', 'jwt', AuthController.getStrategy(db));
    server.auth.default('todo_list_jwt_strategy');

    function printRequest(request){
        try {
            const payload = JSON.stringify(request.payload);
            const params = JSON.stringify(request.params);
            const query = JSON.stringify(request.query);
            console.log(`received ${request.method} ${request.path} query[${query}] params[${params}] payload[${payload}]`)
        } catch (error) {
            console.log(`poof, could not print ${method} ${path}`);
        }
    }

    /**
     * To-do routes
     */

    server.route({
        method: 'POST',
        path: '/todos',
        handler: async (request, h) => {
            printRequest(request);

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
            printRequest(request);

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
            printRequest(request);

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
            printRequest(request);
            
            const result = await TodoController.del(db, request.params);
            if(result === 1){
                return h.response([]).code(200);
            } else {
                return h.response([]).code(404);
            }
        }
    });

    /**
     * Authentication routes
     */
    //TODO check response codes

    server.route({
        method: 'POST',
        path: '/login',
        options: {
            auth: false,
            handler: async (request, h) => {
                printRequest(request);
                
                const result = await AuthController.login(db, request.payload);
    
                if(result.error){
                    return h.response('failed').code(400);
                } else {                    
                    return h.response(result.value).code(200);
                }
            }
        }
    });

    server.route({
        method: 'POST',
        path: '/logout',
        options: {
            auth: false,
            handler: async (request, h) => { 
                printRequest(request);

                //TODO update session state to "logged out"

                h.response(result.value).code(200);
            }
        }
    });
    
    server.route({
        method: 'POST',
        path: '/users',
        options: {
            auth: false,
            handler: async (request, h) => {
                printRequest(request);
                
                const result = await AuthController.register(db, request.payload);

                if(result.error){
                    return h.response('failed').code(400);
                } else {                    
                    return h.response(result.value).code(200);
                }
            }
        }
    });

    server.route({
        method: 'GET',
        path: '/me',
        options: {
            auth: { 
                strategy: 'todo_list_jwt_strategy'
            },
            handler: async (request, h) => {
                printRequest(request);
                
                const result = await AuthController.details(db, h.request);

                if(result.error){
                    return h.response('failed').code(400);
                } else {
                    return h.response(result.value).code(200);
                }
            }
        }
    });

    server.route({
        method: 'PATCH',
        path: '/me',
        options: {
            auth: {
                strategy: 'todo_list_jwt_strategy'
            },
            handler: async (request, h) => {
                printRequest(request);
                
                const result = await AuthController.edit(db, request.payload);
    
                if(result.error){
                    return h.response('failed').code(400);
                } else {
                    return h.response(result.value).code(200);
                }
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