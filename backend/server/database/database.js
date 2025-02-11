const knex = require('knex');
const bcrypt = require('bcrypt');
const saltRounds = 10;

class DatabaseWrapper {
    constructor(){
        const knexConfig = require('../../db/knexfile');
        this.db = knex(knexConfig.development);        
        this.formatted_response = ['id', 'state', 'description', 'createdAt', 'completedAt'];
    }

    /**
     * To-do
     */
    async add(payload, username){
        const description = payload.description;
        try {
            const result_user = await this.db('users')
                .select('id')
                .where({
                    'username': username
                }).first()

            const result = await this.db('items')
                .insert({
                    userId: result_user.id,
                    state: 'INCOMPLETE',
                    description: description, 
                    createdAt: this.db.fn.now(),
                    completedAt: null
                }, this.formatted_response);

            try {
                //convert to ISO8601 format
                const formatted_datetime = new Date(result[0].createdAt).toISOString();
                result[0].createdAt = formatted_datetime;

                return result[0];
            } catch (err) {
                console.error("could not format createdAt date");
                console.error(err);
                return { message: err };
            }

        } catch (err) {
            console.error("Could not insert task");
            console.error(err);
            return { message: err };
        }
    }

    async get(query, username){
        const state = query.filter;
        const field_name = query.orderBy;

        try {
            if(state === 'ALL'){
                const items = await this.db
                    .select('items.id', 'state', 'description', 'createdAt', 'items.completedAt')
                    .from('items')
                    .join('users', 'items.userId', '=', 'users.id')
                    .where({
                        'username': username
                    })
                    .orderBy(field_name);
                return items; 
            } else {
                const items = await this.db
                    .select('items.id', 'state', 'description', 'createdAt', 'items.completedAt')
                    .from('items')
                    .join('users', 'items.userId', '=', 'users.id')
                    .where({
                        'state': state,
                        'username': username
                    })
                    .orderBy(field_name);
                return items;
            }
        } catch (err) {
            console.error(err);
            return []
        }
    }

    async edit(params, payload){
        const id = params.id;
        const state = payload.state;
        const description = payload.description;
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
            const result = await this.db('items')
                .where({id: id})
                .update(update_data, this.formatted_response);

            return result[0]
        } catch (err) {
            console.log(err);
            return []
        }
    }
    
    async del(id){
        try {
            const deleted = await this.db('items')
                .where('id', id)
                .del();
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
            const result = await this.db
                .select('username')
                .from('users')
                .where({'username': username})
                .first();
            return result;
        } catch (e) {
            return undefined;
        }
    }
    
    async checkUserPass(payload){
        const username = payload.username;
        const password = payload.password;
        
        try {
            const result = await this.db
                .select('password')
                .from('users')
                .where({username: username})
                .first();

            const match = await bcrypt.compare(password, result.password);

            if(match){
                return {username: username};
            }

            return {};
        } catch (err) {
            console.error(err);
            return {};
        }
    }
    
    async register(payload){
        const username = payload.username;
        const email = payload.email;
        const password = payload.password;

        const hash = bcrypt.hashSync(password, saltRounds);
        
        try {
            const result = await this.db('users')
                .insert({ 
                    username: username,
                    email: email, 
                    password: hash
                }, ['username']);
            return result[0];
        } catch (err) {
            console.error(err);
            return []
        }
    }
    
    async details(username){
        try {
            const result = await this.db
                .select(['username', 'email'])
                .from('users')
                .where({'username': username})
                .first();
            return result; 
        } catch (err) {
            console.error(err);
            return {}
        }
    }

    async editDetails(payload, username){
        const password = payload.password;
        
        if(password){
            const hash = bcrypt.hashSync(password, saltRounds);
            payload.password = hash;
        }

        try {
            const result = await this.db('users')
                .where({'username': username})
                .update(payload, ['username', 'email']);
            return result[0];
        } catch (err) {
            console.error(err);
            return []
        }
    }
}

module.exports = DatabaseWrapper


