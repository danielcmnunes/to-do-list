import React, { useState, useContext } from 'react';
import { Container, Row, Col, Button, ButtonGroup, Form } from 'react-bootstrap';
import {TodoListContext} from '../context/TodoListContext.js';

function TaskInput() {
    const {items, setContextList} = useContext(TodoListContext);

    const [textInput, setTextInput] = useState('');
  
    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            const response = await fetch("http://localhost:3001/todos", {
                method : 'POST',
                headers : {'Content-Type': 'application/json'},
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
        <Container className='m-3'>
            <Form onSubmit={handleSubmit}>
                <Row>
                    <Col xs={7} md={9} lg={10}>
                        <Form.Group controlId='textInput'>
                            <Form.Control required type="text" 
                                placeholder="Write new task here..."
                                value={textInput} 
                                onChange={(e) => setTextInput(e.target.value)}    
                            />
                        </Form.Group>
                    </Col>
                    <Col xs={5} md={3} lg={2}>
                        <Button variant="primary" type="submit">
                            Create
                        </Button>
                    </Col>
                </Row>
            </Form>
        </Container>
    );
}

export default TaskInput;