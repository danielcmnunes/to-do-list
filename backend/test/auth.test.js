'use strict';

const Lab = require('@hapi/lab');
const { expect } = require('@hapi/code');
const { afterEach, beforeEach, describe, it, before } = exports.lab = Lab.script();
const { init } = require('../lib/server');

describe('POST /login', () => {
    let server;

    before(async () => {
        const knex = require('knex');
        const knexConfig = require('../db/knexfile');
        const knexInstance = knex(knexConfig.development);
        knexInstance.seed.run();
    });

    beforeEach(async () => {
        server = await init();
    });

    afterEach(async () => {
        await server.stop();
    });
    
    const payloads = [
        {
            description: 'login without credentials',
            payload: { 'username': '', 'password': '' },
            expectedCode: 400,
            expectedResponse: undefined
        },
        {
            description: 'login with non existing username only',
            payload: { 'username': 'alien', 'password': '' },
            expectedCode: 400,
            expectedResponse: undefined
        },
        {
            description: 'login with existing username only',
            payload: { 'username': 'daniel', 'password': '' },
            expectedCode: 400,
            expectedResponse: undefined
        },
        {
            description: 'login with existing username and wrong password',
            payload: { 'username': 'daniel', 'password': 'a wrong password' },
            expectedCode: 401,
            expectedResponse: undefined
        },
        {
            description: 'login with correct credentials',
            payload: { 'username': 'daniel', 'password': 'UhIjbciLEjVS' },
            expectedCode: 200,
            expectedResponse: undefined
        }
    ];

    payloads.forEach( ({description, payload, expectedCode, expectedResponse}) => {
        it(description, async () => {
            const res = await server.inject({
                method: 'POST',
                url: '/login',
                payload: payload
            });
            expect(res.statusCode).to.equal(expectedCode);

            if(expectedResponse){
                expect(res.result).to.equal(expectedResponse);
            }
        });
    });
});

describe('POST /users', () => {
    let server;
    let token = undefined;

    beforeEach(async () => {
        server = await init();
    });

    afterEach(async () => {
        await server.stop();
    });
    
    const payloads = [
        {
            description: 'register without user nor email nor password',
            payload: { 'username': '', 'email': '', 'password': '' },
            expectedCode: 400,
            expectedResponse: undefined
        },
        {
            description: 'register without password',
            payload: { 'username': 'test_user', 'email': 'test_user@example.com', 'password': '' },
            expectedCode: 400,
            expectedResponse: undefined
        },
        {
            description: 'register without email',
            payload: { 'username': 'test_user', 'email': '', 'password': 'test_password' },
            expectedCode: 400,
            expectedResponse: undefined
        },
        {
            description: 'register without username',
            payload: { 'username': '', 'email': 'test_user@example.com', 'password': 'test_password' },
            expectedCode: 400,
            expectedResponse: undefined
        },
        {
            description: 'register with username and password',
            payload: { 'username': 'test_user', 'email': 'test_user@example.com', 'password': 'test_password' },
            expectedCode: 200,
            expectedResponse: undefined
        }
    ];

    payloads.forEach( ({description, payload, expectedCode, expectedResponse}) => {
        it(description, async () => {
            const res = await server.inject({
                method: 'POST',
                url: '/users',
                payload: payload
            });
            expect(res.statusCode).to.equal(expectedCode);

            if(expectedResponse){
                expect(res.result).to.equal(expectedResponse);
            }
    
            try{
                if(res.result.token){
                    token = res.result.token;
                }
            } catch(e){
                //shh
            }        
        });
    });
});
