'use strict';

const Jwt = require('@hapi/jwt');
const Hapi = require('@hapi/hapi');
const DatabaseWrapper = require('../server/database/database');

const PostLogin = require('../server/routes/PostLogin');
const PostLogout = require('../server/routes/PostLogout');
const PostUsers = require('../server/routes/PostUsers');
const GetMe = require('../server/routes/GetMe');
const PatchMe = require('../server/routes/PatchMe');
const GetTodos = require('../server/routes/GetTodos');
const PostTodos = require('../server/routes/PostTodos');
const PatchTodo = require('../server/routes/PatchTodo');
const DeleteTodo = require('../server/routes/DeleteTodo');

const Inert = require('@hapi/inert');
const Vision = require('@hapi/vision');
const HapiSwagger = require('hapi-swagger');



exports.init = async () => {
    //avoid registering plugins and routes twice; won't work for swagger
    // const registeredPlugins = Object.keys(server.registrations);
    // if(registeredPlugins.length > 0){
    //     await server.initialize();
    //     return server;
    // }
    const server = Hapi.server({
        port: 3001,
        host: 'localhost',
        routes: {
            cors: {
                origin: ['*'],
                credentials: true
            },
        },
    });
        
    const database = new DatabaseWrapper();
    server.db = database;

    /**
     * Swagger documentation
     */
    await server.register([
        Inert,
        Vision,
        {
            plugin: HapiSwagger,
            options: {
                //jsonRoutePath: "/docs",
                documentationPath: "/docs",
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
    await server.register(Jwt);
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
            const user = await database.getUser(artifacts.decoded.payload.user);
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

exports.start = async(server) => {
    await server.start();
    console.log(`Server running at: ${server.info.uri}`);
    return server;
};

process.on('unhandledRejection', (err) => {
    console.log(err);
    process.exit(1);
});

// let env = process.env.NODE_ENV;
// if(env !== 'test'){
//     console.log("not in tests");
//     init();
// } else {
//     console.log("testing mode");
// }