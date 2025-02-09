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

const server = Hapi.server({
    port: 3001,
    host: 'localhost',
    routes: {
        cors: {
            origin: ['*'], //using localhost will only make accept same machine connections?
        },
    },
});

//Database
const db = new DatabaseWrapper();
server.db = db;

exports.init = async () => {
    //avoid registering plugins and routes twice; won't work for swagger
    const registeredPlugins = Object.keys(server.registrations);
    if(registeredPlugins.length > 0){
        await server.initialize();
        return server;
    }

    /**
     * Swagger documentation support
     */
    await server.register([
        Inert,
        Vision,
        {
            plugin: HapiSwagger,
            options: { //Swagger options
                jsonRoutePath: "/docs",
                info: {
                    title: 'Test API Documentation',
                    version: "1.0",
                },
                grouping: 'tags'
            }
        }
    ], {
        once: true
    });

    /**
     * JSON Web Tokens
     */
    
    await server.register(Jwt, { once: true });
    server.auth.strategy('todo_list_jwt_strategy', 'jwt', {
        keys: 'some_shared_secret',
        verify: {
            aud: 'urn:audience:test',
            iss: 'urn:issuer:test',
            sub: false,
            nbf: true,
            exp: true,
            maxAgeSec: 14400, // 4 hours
            timeSkewSec: 15
        },
        validate: async (artifacts, request, h) => {            
            const user = await server.db.getUser(artifacts.decoded.payload.user);
            if (!user) {
                return { isValid: false };
            }
            return {
                isValid: true,
                credentials: { username: artifacts.decoded.payload.user }
            };
        }
    });
    server.auth.default('todo_list_jwt_strategy');

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

    await server.initialize();
    return server;
};

exports.start = async () => {
    await server.start();
    console.log('Server running on %s', server.info.uri);
};

process.on('unhandledRejection', (err) => {
    console.log(err);
    process.exit(1);
});