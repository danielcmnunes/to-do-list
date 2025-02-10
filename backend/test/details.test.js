'use strict';

const Lab = require('@hapi/lab');
const { expect } = require('@hapi/code');
const { afterEach, beforeEach, describe, it, before } = exports.lab = Lab.script();
const { init } = require('../server/server');

/**
 * Returns true if all properties in the expected_object are present 
 * and have the same value in the received_object.
 * @param {json} expected_object 
 * @param {json} received_object 
 */
function comparePayloads(expected_object, received_object){
    //different types
    if(typeof expected_object != typeof received_object){
        return false;
    }    

    //literals
    if(typeof expected_object !== 'object'){
        return expected_object === received_object;
    }

    const expected_object_keys = Object.keys(expected_object);

    expected_object_keys.forEach( (key) => {
        const expected_value = expected_object[key];
        const received_value = received_object[key];

        if(!expected_object_keys.includes(key)){
            console.log(`failed to find ${key} in:`);
            console.log(`${received_object}`);
            return false;
        }
        
        if(expected_value !== received_value){
            console.log(`${expected_value} != in: ${received_value} for property ${key} in:`);
            console.log(`${received_object}`);
            return false;
        }
    });
    return true;
}

describe('GET and PATCH /me', () => {
    let server;
    let token = undefined;

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
