'use strict';

const Lab = require('@hapi/lab');
const { expect } = require('@hapi/code');
const { afterEach, beforeEach, describe, it, before } = exports.lab = Lab.script();
const { init } = require('../lib/server');

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

describe('POST todos', () => {
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

    const payloads = [
        {
            description: 'request without payload',
            payload: undefined,
            expectedCode: 400,
            expectedResponse: {}
        },
        {
            description: 'request with empty description',
            payload: { description:''},
            expectedCode: 400,
            expectedResponse: {}
        },
        {
            description: 'request with description: Buy a notebook',
            payload: { description:'Buy a notebook'},
            expectedCode: 200,
            expectedResponse: {
                state: 'INCOMPLETE',
                description: 'Buy a notebook',
                completedAt: null
            }
        }
    ];

    payloads.forEach( ({description, payload, expectedCode, expectedResponse}) => {
        it(description, async () => {
            const res = await server.inject({
                method: 'POST',
                url: '/todos',
                payload: payload,
                headers : {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer '+ token
                }
            });
            expect(res.statusCode).to.equal(expectedCode);

            if(res.result){
                expect( comparePayloads(expectedResponse, res.result) ).to.equal(true);
            }
        });
    });
});

describe('GET todos', () => {
    let server;
    let token = undefined;

    beforeEach(async () => {
        server = await init();
    });

    afterEach(async () => {
        await server.stop();
    });

    it("request without a valid token", async () => {
        const res = await server.inject({
            method: 'GET',
            url: '/todos',
            headers : {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer invalid'
            }
        });
        expect(res.statusCode).to.equal(401);
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
    
    it("request without filters", async () => {
        const res = await server.inject({
            method: 'GET',
            url: '/todos',
            headers : {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer '+ token
            }
        });
        expect(res.statusCode).to.equal(200);
    });

    it("request only COMPLETE tasks", async () => {
        const res = await server.inject({
            method: 'GET',
            url: '/todos?filter=COMPLETE',
            headers : {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer '+ token
            }
        });
        expect(res.statusCode).to.equal(200);

        const complete_tasks = res.result.filter( (item) => item.state === 'COMPLETE');

        expect(res.result.length).to.equal(complete_tasks.length);
    });

    it("request only INCOMPLETE tasks", async () => {
        const res = await server.inject({
            method: 'GET',
            url: '/todos?filter=INCOMPLETE',
            headers : {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer '+ token
            }
        });
        expect(res.statusCode).to.equal(200);

        const complete_tasks = res.result.filter( (item) => item.state === 'INCOMPLETE');

        expect(res.result.length).to.equal(complete_tasks.length);
    });

    it("request tasks ordered by DESCRIPTION", async () => {
        const res = await server.inject({
            method: 'GET',
            url: '/todos?orderBy=DESCRIPTION',
            headers : {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer '+ token
            }
        });
        expect(res.statusCode).to.equal(200);

        const descriptions = res.result.map( (item) => item.description);
        const sorted_descriptions = res.result.map( (item) => item.description).sort();

        expect(descriptions).to.equal(sorted_descriptions);
    });

    it("request tasks ordered by CREATED_AT", async () => {
        const res = await server.inject({
            method: 'GET',
            url: '/todos?orderBy=CREATED_AT',
            headers : {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer '+ token
            }
        });
        expect(res.statusCode).to.equal(200);

        const dates = res.result.map( (item) => item.createdAt);
        const sorted_dates = res.result.map( (item) => item.createdAt).sort();

        expect(dates).to.equal(sorted_dates);
    });

    it("request tasks ordered by COMPLETED_AT", async () => {
        const res = await server.inject({
            method: 'GET',
            url: '/todos?filter=COMPLETE&orderBy=COMPLETED_AT',
            headers : {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer '+ token
            }
        });
        expect(res.statusCode).to.equal(200);

        const dates = res.result
            .filter( (item) => item.completedAt !== null)
            .map( (item) => item.completedAt);

        const sorted_dates = res.result
            .filter( (item) => item.completedAt !== null)
            .map( (item) => item.completedAt).sort();

        expect(dates).to.equal(sorted_dates);
    });

    it("request COMPLETE tasks ordered by COMPLETED_AT", async () => {
        const res = await server.inject({
            method: 'GET',
            url: '/todos?filter=COMPLETE&orderBy=COMPLETED_AT',
            headers : {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer '+ token
            }
        });
        expect(res.statusCode).to.equal(200);

        const dates = res.result.map( (item) => item.completedAt);
        const sorted_dates = res.result.map( (item) => item.completedAt).sort();

        expect(dates).to.equal(sorted_dates);
    });

    it("request INCOMPLETE tasks ordered by COMPLETED_AT", async () => {
        const res = await server.inject({
            method: 'GET',
            url: '/todos?filter=INCOMPLETE&orderBy=CREATED_AT',
            headers : {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer '+ token
            }
        });
        expect(res.statusCode).to.equal(200);

        const dates = res.result.map( (item) => item.completedAt);
        const sorted_dates = res.result.map( (item) => item.completedAt).sort();

        expect(dates).to.equal(sorted_dates);
    });
});

