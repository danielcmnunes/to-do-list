'use strict';

const Jwt = require('@hapi/jwt');
const Hapi = require('@hapi/hapi');
const Authentication = require('./auth/Authentication');
const DatabaseWrapper = require('./database/database');

const PostLogin = require('./routes/PostLogin');
const PostLogout = require('./routes/PostLogout');
const PostUsers = require('./routes/PostUsers');
const GetMe = require('./routes/GetMe');
const PatchMe = require('./routes/PatchMe');
const GetTodos = require('./routes/GetTodos');
const PostTodos = require('./routes/PostTodos');
const PatchTodo = require('./routes/PatchTodo');
const DeleteTodo = require('./routes/DeleteTodo');

const Inert = require('@hapi/inert');
const Vision = require('@hapi/vision');
const HapiSwagger = require('hapi-swagger');

const init = async () => {

    const server = Hapi.server({
        port: 3001,
        host: 'localhost',
        routes: {
            cors: {
                origin: ['*'], //using localhost will only make accept same machine connections?
            },
        },
    });
    
    const db = new DatabaseWrapper();
    server.db = db;

    /**
     * Swagger documentation
     */
    const swaggerOptions = {
        info: {
            title: 'Test API Documentation',
            version: "1.0",
        },
        grouping: 'tags'
    };

    await server.register([
        Inert,
        Vision,
        {
            plugin: HapiSwagger,
            options: swaggerOptions
        }
    ]);

    /**
     * JSON Web Tokens
     */
    await server.register(Jwt);
    server.auth.strategy('todo_list_jwt_strategy', 'jwt', Authentication.getStrategy(db));
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
    GetTodos(server);
    PostTodos(server);
    PatchTodo(server);
    DeleteTodo(server);

    /**
     * Authentication routes
     */
    PostLogin(server);
    PostLogout(server);
    PostUsers(server);
    
    /**
     * Details routes
     */
    GetMe(server);
    PatchMe(server);

    await server.start();
    console.log('Server running on %s', server.info.uri);
};

process.on('unhandledRejection', (err) => {

    console.log(err);
    process.exit(1);
});

init();