const knex = require('knex');

class DatabaseWrapper {
    constructor(){        
        const knexConfig = require('../../db/knexfile');
        console.log(`knex configuration type: ${process.env.NODE_ENV}`);
        this.db = knex(knexConfig[process.env.NODE_ENV]);
    }

    async add(_description){
        try {            
            const result = await this.db('items').insert({ 
                state: 'INCOMPLETE',
                description: _description, 
                createdAt: this.db.fn.now(),
                completedAt: null
            });
            return result;
        } catch (error) {
            console.error(error);
            return [];
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

    async get(state, field){
        //TODO: hide incompleted when order by completed_at?
        try {
            if(state === 'ALL'){
                const items = await this.db.select('*').from('items').orderBy(field);
                return items; 
            } else {
                const items = await this.db.select('*').from('items').where('state', state).orderBy(field);
                return items;
            }
        } catch (err) {
            console.error(err);
            return []
        }
    }

    async edit(id, state, description){
        const formatted_response = ['id', 'state', 'description', 'createdAt', 'completedAt'];

        const update_data = {};
        if(state){
            if(state === 'COMPLETE'){
                update_data.state = state;
                update_data.completedAt = this.db.fn.now();
            } else {
                //will never be here though 
                update_data.state = state;
                update_data.completedAt = null;
            }
        }

        if(description){
            update_data.description = description;
        }

        console.log(update_data)

        try {
            const edited = await this.db('items').where({id: id}).update(update_data, formatted_response);
            return edited
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


