import React, { useEffect, useContext, useState } from 'react';
import { Container } from 'react-bootstrap';
import TaskItem from './TaskItem';
import { TodoListContext } from '../context/TodoListContext.js';
import { TodoListDisplayContext } from '../context/TodoListDisplayContext.js';
import { AuthContext } from '../context/AuthContext.js';

function TaskList() {
    const {hideCompleted, sortingOrder} = useContext(TodoListDisplayContext);
    const {items, setContextList, setFailMessage} = useContext(TodoListContext);
    const {token} = useContext(AuthContext);
    
    useEffect(() => {
        async function fetchData(){
            try {
                const response = await fetch("http://localhost:3001/todos", {
                    method : 'GET',
                    headers : {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer '+ token
                    }
                });
        
                const data = await response.json();

                if(data.message){
                    setFailMessage("Could not add task.");
                } else {
                    setContextList(data);
                }
            } catch(error){
                console.log("could not fetch tasks");
                console.log(error);
            }
        }
        fetchData();
    }, [token, setContextList]);

    useEffect( () => {

    }, [hideCompleted, sortingOrder]);

    return (
        <Container>
            {
                items && items.length > 0 ?
                items
                .sort((a, b) => {
                    if(sortingOrder === 'asc'){
                        if(a.description > b.description){
                            return 1;
                        } else {
                            return -1;
                        };
                    } else if(sortingOrder === 'desc'){
                        if(a.description < b.description){
                            return 1;
                        } else {
                            return -1;
                        };
                    } else {
                        if(a.createdAt > b.createdAt){
                            return 1;
                        } else {
                            return -1;
                        };
                    } 
                })
                .filter(item => { 
                    return !(hideCompleted && item.state === 'COMPLETE');
                })
                .map(item => {
                    return <TaskItem key={item.id} id={item.id} state={item.state} description={item.description}/>
                }) 
                : 
                <div>There are no tasks.</div>
            }
        </Container>
    );
}

export default TaskList;