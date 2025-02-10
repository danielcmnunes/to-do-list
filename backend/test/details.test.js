'use strict';

const Lab = require('@hapi/lab');
const { expect } = require('@hapi/code');
const { afterEach, beforeEach, describe, it, before } = exports.lab = Lab.script();
const { init } = require('../lib/server');

describe('GET and PATCH /me', () => {
    let server;
    let token = undefined;

    before(async () => {
        const knex = require('knex');
        const knexConfig = require('../db/knexfile');
        const knexInstance = knex(knexConfig.development);
        await knexInstance.seed.run();
    });

    beforeEach(async () => {
        server = await init();
    });

    afterEach(async () => {
        await server.stop();
    });

    it("login with valid credentials in order to get valid token", async () => {
        const res = await server.inject({
            method: 'POST',
            url: '/login',
            payload: { 'username': 'daniel', 'password': 'UhIjbciLEjVS' }
        });
        expect(res.statusCode).to.equal(200);

        try{
            token = res.result.token;
        } catch(e){
            console.log("got no token");
        }        
    });

    it("get details of the authenticated user", async () => {
        const res = await server.inject({
            method: 'GET',
            url: '/me',
            headers : {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer '+ token
            }
        });
        expect(res.statusCode).to.equal(200);
        expect(res.result).to.equal({
            username: 'daniel',
            email: 'test@example.com'
        });
    });

    it("modify email to bananas@example.com", async () => {
        const res = await server.inject({
            method: 'PATCH',
            url: '/me',
            headers : {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer '+ token
            },
            payload: {
                'email': 'bananas@example.com'
            }
        });
        expect(res.statusCode).to.equal(200);
        expect(res.result).to.equal({
            username: 'daniel',
            email: 'bananas@example.com'
        });
    });

    it("confirm the email is returned by the server", async () => {
        const res = await server.inject({
            method: 'GET',
            url: '/me',
            headers : {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer '+ token
            }
        });
        expect(res.statusCode).to.equal(200);
        expect(res.result).to.equal({
            username: 'daniel',
            email: 'bananas@example.com'
        });
    });

    it("modify password to betterPassWord123", async () => {
        const res = await server.inject({
            method: 'PATCH',
            url: '/me',
            headers : {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer '+ token
            },
            payload: {
                'password': 'betterPassWord123'
            }
        });
        expect(res.statusCode).to.equal(200);
        expect(res.result).to.equal({
            username: 'daniel',
            email: 'bananas@example.com'
        });
    });
    
    it("login with old password", async () => {
        const res = await server.inject({
            method: 'POST',
            url: '/login',
            payload: { 'username': 'daniel', 'password': 'UhIjbciLEjVS' }
        });
        expect(res.statusCode).to.equal(401);

        try{
            token = res.result.token;
        } catch(e){
            console.log("got no token");
        }        
    });

    it("login with new password", async () => {
        const res = await server.inject({
            method: 'POST',
            url: '/login',
            payload: { 'username': 'daniel', 'password': 'betterPassWord123' }
        });
        expect(res.statusCode).to.equal(200);

        try{
            token = res.result.token;
        } catch(e){
            console.log("got no token");
        }        
    });    
});
