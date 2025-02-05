const knex = require('knex');

class DatabaseWrapper {
    constructor(){
        const knexConfig = require('../../db/knexfile');
        this.db = knex(knexConfig[process.env.NODE_ENV]);        
        this.formatted_response = ['id', 'state', 'description', 'createdAt', 'completedAt'];
    }

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

        //TODO: hide incompleted when order by completed_at?
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
                update_data.state = state;
                update_data.completedAt = this.db.fn.now();
            } else {
                update_data.state = state;
                update_data.completedAt = null;
            }
        }

        if(description){
            update_data.description = description;
        }

        try {
            const result = await this.db('items').where({id: id}).update(update_data, this.formatted_response);
            return result[0]
        } catch (err) {
            console.error(err);
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

}

module.exports = DatabaseWrapper


