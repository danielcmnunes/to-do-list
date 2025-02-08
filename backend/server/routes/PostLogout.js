'use strict';

const AuthSchemas = require('../validation/AuthSchemas');

function PostLogout(server){
    server.route({
        method: 'POST',
        path: '/logout',
        options: {
            description: 'Returns an empty response',
            tags: ['api', 'auth'],
            auth: false,
            handler: async (request, h) => {                
                h.response(result.value).code(200);
            },
            validate: {
                payload: AuthSchemas.logoutRequest()
            }
        }
    });
};

module.exports = PostLogout;