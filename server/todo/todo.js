class Todo {}

Todo.sanitizeFilter = function(filter){
    switch(filter){
        case 'ALL': return 'ALL';
        case 'COMPLETE': return 'COMPLETE';
        case 'INCOMPLETE': return 'INCOMPLETE';
        default:
            return 'ALL';
    }       
}

Todo.sanitizeOrderBy = function(orderBy){
    switch(orderBy){
        case 'DESCRIPTION': return 'description';
        case 'CREATED_AT': return 'createdAt';
        case 'COMPLETED_AT': return 'description';
        case 'DESCRIPTION': return 'description';
        default:
            return 'createdAt'; 
    }       
}

Todo.get = async function(database, payload){
    const state = Todo.sanitizeFilter(payload.filter);
    const field = Todo.sanitizeOrderBy(payload.orderBy);  

    const get_result = await database.get(state, field);
    return get_result;
};

Todo.post = async function(database, payload){
    const add_result = await database.add(payload.description);

    if(add_result.length > 0){
        const get_result = await database.getById(add_result[0]);
        return get_result;
    } else {
        return [];
    }
};

Todo.edit = async function(database, params, payload){
    const id = params.id;
    const get_result = await database.getById(id);

    if(get_result.length > 0){
        const row = get_result[0];

        if(row.completedAt !== null){
            return 400;
        }

        const edit_result = await database.edit(id, payload.state, payload.description);

        if(edit_result.length > 0){
            const get_result = await database.getById(id);
            return get_result;
        } else {
            return [];
        }

    } else {
        return 404;
    }

    //TODO check if exists first, return 404

    //TODO check if complete, return 400 if so

    const edit_result = await database.edit(params.id, payload.state, payload.description);

    if(edit_result.length > 0){
        const get_result = await database.getById(add_result[0]);
        return get_result;
    } else {
        return [];
    }
};


module.exports = Todo