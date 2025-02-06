import React, { useState } from 'react';
import { Container, Row, Col, Button, ButtonGroup, Form } from 'react-bootstrap';

function TaskInput({onSubmitTask}) {
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
            
            console.log("TODO: implement feedback behavior");
            
        } catch(error){
            console.log("could not add task");
            console.log(error);
        }
    };

    return (
        <Container className='m-3'>
            <Form onSubmit={handleSubmit}>
                <Row>
                    <Col lg={9}>
                        <Form.Group controlId='textInput'>
                            <Form.Control required type="text" 
                                placeholder="Write new task here..."
                                value={textInput} 
                                onChange={(e) => setTextInput(e.target.value)}    
                            />
                        </Form.Group>
                    </Col>
                    <Col lg={3}>
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