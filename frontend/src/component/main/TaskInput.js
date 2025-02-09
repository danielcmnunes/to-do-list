import React, { useState, useContext } from 'react';
import { Container, Row, Col, Button, Form } from 'react-bootstrap';
import {TodoListContext} from '../context/TodoListContext.js';
import { AuthContext } from '../context/AuthContext.js';
import ListSorting from './ListSorting.js';

function TaskInput() {
    const {items, setContextList} = useContext(TodoListContext);
    const {token} = useContext(AuthContext);

    const [textInput, setTextInput] = useState('');
  
    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            const response = await fetch("http://localhost:3001/todos", {
                method : 'POST',
                headers : {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer '+ token
                },
                body : JSON.stringify({
                    'description': textInput
                })
            });
            
            const data = await response.json();

            const newItems = [...items, data];
            setContextList(newItems);
            setTextInput('');

            console.log("TODO: implement feedback behavior")
            
        } catch(error){
            console.log("could not add task");
            console.log(error);
        }
    };

    return (
        <>
            <Col xs={1} >
                <ListSorting/>
            </Col>
            <Col sm={6} md={8} lg={9} className="ml-0 mr-0">
                <Form onSubmit={handleSubmit}  className='mx-0'>
                    <Form.Group controlId='textInput'>
                        <Form.Control required type="text" 
                            placeholder="Write new task here..."
                            value={textInput} 
                            onChange={(e) => setTextInput(e.target.value)}    
                        />
                    </Form.Group>
                </Form>
            </Col>
            <Col sm={5} md={3} lg={2} className="mx-0">
                <Button className="w-100" variant="primary" type="submit">
                    Create
                </Button>
            </Col>
        </>
    );
}

export default TaskInput;