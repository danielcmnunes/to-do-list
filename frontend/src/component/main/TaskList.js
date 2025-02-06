import React, { useEffect, useState, useContext } from 'react';
import { Container, Row, Col, Button, ButtonGroup, Form, InputGroup } from 'react-bootstrap';
import TaskItem from './TaskItem';
import { TodoListContext } from '../TodoListContext.js';

function TaskList() {
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
  
    return (
        <Container> 
            {
                items && items.length > 0 ?
                items.map(item => {
                    return <TaskItem key={item.id} id={item.id} state={item.state} description={item.description}/>
                }) 
                : 
                <div>Loading...</div>
            }
        </Container>
    );
}

export default TaskList;