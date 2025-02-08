const knex = require('knex');

class DatabaseWrapper {
    constructor(){
        const knexConfig = require('../../db/knexfile');
        // this.db = knex(knexConfig[process.env.NODE_ENV]);
        this.db = knex(knexConfig.development);        
        this.formatted_response = ['id', 'state', 'description', 'createdAt', 'completedAt'];
    }

    /**
     * To-do
     */

    async add(validatedFields){
        const description = validatedFields.description;
        try {
            const result = await this.db('items').insert({ 
                state: 'INCOMPLETE',
                description: description, 
                createdAt: this.db.fn.now(),
                completedAt: null
            }, this.formatted_response);

            if(result.length === 1){
                try {
                    //convert to ISO8601 format
                    const formatted_datetime = new Date(result[0].createdAt).toISOString();
                    result[0].createdAt = formatted_datetime;

                    return result[0];
                } catch (err) {
                    console.error(err);
                    return undefined;
                }

            } else {
                return undefined;
            }
        } catch (err) {
            console.error(err);
            return undefined;
        }
    }

    async getById(id){
        try {
            const result = await this.db.select('*').from('items').where('id', id);
            return result;            
        } catch (error) {            
            return [];
        };
    }

    async get(validatedFields){
        const state = validatedFields.filter;
        const field_name = validatedFields.orderBy;

        try {
            if(state === 'ALL'){
                const items = await this.db.select('*').from('items').orderBy(field_name);
                return items; 
            } else {
                const items = await this.db.select('*').from('items').where('state', state).orderBy(field_name);
                return items;
            }
        } catch (err) {
            console.error(err);
            return []
        }
    }

    async edit(id, state, description){
        const update_data = {};

        if(state){
            if(state === 'COMPLETE'){
                //use ISO8601 format
                const formatted_datetime = new Date().toISOString();
                update_data.completedAt = formatted_datetime;
                update_data.state = state;
            } else {
                update_data.completedAt = null;
                update_data.state = state;
            }
        }

        if(description){
            update_data.description = description;
        }

        try {
            const result = await this.db('items').where({id: id}).update(update_data, this.formatted_response);
            return result[0]
        } catch (err) {
            console.log(err);
            return []
        }
    }
    
    async del(id){
        try {
            const deleted = await this.db('items').where('id', id).del();
            return deleted;
        } catch (err) {
            console.error(err);
            return []
        }
    }

    /**
     * Authentication
     */

    async getUser(username){
        try {            
            const result = await this.db.select('username').from('users').where({'username': username}).first();
            return result;
        } catch (e) {
            return undefined;
        }
    }
    
    async checkUserPass(validatedFields){
        const username = validatedFields.username;
        const password = validatedFields.password;

        try {
            const result = await this.db.select('username').from('users').where({username: username, password: password}).first();
            return result;
        } catch (err) {
            console.error(err);
            return {};
        }
    }

    async logout(validatedFields){
        const username = validatedFields.username;
        const token = validatedFields.token;

        try {
            const result = await this.db('users').where({username: username, token: token}).update({token: null});
            return result; 
        } catch (err) {
            console.error(err);
            return []
        }
    }
    
    async register(validatedFields){
        const username = validatedFields.username;
        const email = validatedFields.email;
        const password = validatedFields.password;
        
        try {
            const result = await this.db('users').insert({ 
                username: username,
                email: email, 
                password: password, 
                createdAt: this.db.fn.now(),
                lastLogin: this.db.fn.now()
            }, ['username']);
            return result[0];
        } catch (err) {
            console.error(err);
            return []
        }
    }
    
    async details(username){
        try {
            const result = await this.db.select(['username', 'email']).from('users').where({'username': username}).first();
            return result; 
        } catch (err) {
            console.error(err);
            return {}
        }
    }

    async editDetails(validatedFields, username){
        try {
            const result = await this.db('users').where({'username': username})
                .update(validatedFields, ['username', 'email']);
            return result[0];
        } catch (err) {
            console.error(err);
            return []
        }
    }


}

module.exports = DatabaseWrapper


