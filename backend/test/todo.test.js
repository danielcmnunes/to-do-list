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


describe('PATCH todo', { serial: true }, () => {
    let server;
    let token = undefined;
    let context = undefined;

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

    it("request incomplete tasks", async () => {
        const res = await server.inject({
            method: 'GET',
            url: '/todos?filter=INCOMPLETE',
            headers : {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer '+ token
            }
        });
        expect(res.statusCode).to.equal(200);

        try {
            context = res.result[0];
        } catch(e){
            console.log("could not save target item");
        }
    });

    // const payloads = [
    //     {
    //         description: 'modify target item state to COMPLETE ',
    //         params: context.id,
    //         payload: { state: 'COMPLETE'},
    //         expectedCode: 200,
    //         expectedResponse: {
    //             id: context.id,
    //             state: 'COMPLETE',
    //             description: context.description,
    //             createdAt: context.createdAt
    //         }
    //     }
    // ];

    // payloads.forEach( ({description, params, payload, expectedCode, expectedResponse}) => {
    //     it(description, async () => {
    //         console.log(params, payload, expectedCode, expectedResponse);
    
    //         const res = server.inject({
    //             method: 'PATCH',
    //             url: '/todo/' + params,
    //             payload: payload,
    //             headers : {
    //                 'Content-Type': 'application/json',
    //                 'Authorization': 'Bearer '+ token
    //             }
    //         });
            
    //         console.log("RECEIVED");
    //         console.log(res);

    //         expect(res.statusCode).to.equal(expectedCode);


    //         if(res.result){                
    //             expect( comparePayloads(expectedResponse, res.result) ).to.equal(true);
    //         }
    //     });
    // });
});
