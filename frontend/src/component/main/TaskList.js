import React, { useEffect, useState, useContext } from 'react';
import { Container, Row, Col, Button, ButtonGroup, Form, InputGroup } from 'react-bootstrap';
import TaskItem from './TaskItem';
import { TodoListContext } from '../TodoListContext.js';
import { TodoListDisplayContext } from '../TodoListDisplayContext.js';

function TaskList() {
    const {hideCompleted, } = useContext(TodoListDisplayContext);
    const {sortingOrder, } = useContext(TodoListDisplayContext);
    const {items, setContextList} = useContext(TodoListContext);
    
    useEffect(() => {
        console.log(`asking list...`);
        async function fetchData(){
            try {
                const response = await fetch("http://localhost:3001/todos", {
                    method : 'GET',
                    headers : {'Content-Type': 'application/json'}
                });
        
                const data = await response.json();

                setContextList(data);
            } catch(error){
                console.log("could not fetch tasks");
                console.log(error);
            }
        }
        fetchData();
    }, [setContextList]);

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