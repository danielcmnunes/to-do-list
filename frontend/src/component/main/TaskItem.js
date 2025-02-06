import React, { useEffect, useState, useContext } from 'react';
import { Container, Row, Col, Button, ButtonGroup, Form } from 'react-bootstrap';
import {TodoListContext} from '../TodoListContext.js';

function TaskItem({id, state, description}) {
    const [_id, setId] = useState(id);
    const [isComplete, setComplete] = useState(state);
    const [_description, setDescription] = useState(description);
    const [descriptionInput, setDescriptionInput] = useState(description);
    const [isEditing, setEditing] = useState(false);
    const [descriptionStyle, setDescriptionStyle] = useState({textDecorationLine: 'none'});
    
    const {items, setContextList} = useContext(TodoListContext);

    useEffect( () => {
        const decorationValue = isComplete === 'COMPLETE' ? "line-through" : "none";
        setDescriptionStyle({ textDecorationLine: decorationValue });
    }, [isComplete]);

    const enableEditing = () => {
        setEditing(true);
    }

    const discardChanges = () => {
        setDescriptionInput(_description);
        setEditing(false);
    }

    const saveChanges = () => {
        console.log(`save`);
        setEditing(false);

        async function sendUpdate(){
            try {
                const response = await fetch("http://localhost:3001/todo/" + id, {
                    method : 'PATCH',
                    headers : {'Content-Type': 'application/json'},
                    body: JSON.stringify({
                        description: descriptionInput
                    })
                });
        
                const data = await response.json();
                console.log(data);


                setComplete(data.state === 'COMPLETE');
                setDescription(data.description);

            } catch(error){
                console.log("could not update task");
                console.log(error);
            }
        }
        sendUpdate();
    }

    const deleteItem = () => {
        async function sendDelete(){
            try {
                const response = await fetch("http://localhost:3001/todo/" + id, {
                    method : 'DELETE',
                    headers : {'Content-Type': 'application/json'}
                });
        
                const data = await response.json();

                console.log(`received delete`, data);

            } catch(error){
                console.log("could not delete task");
                console.log(error);
            }
        }  
        sendDelete();
    }

    const handleCheckboxClick = (e) => {
        const newIsComplete = isComplete === 'COMPLETE' ? 'INCOMPLETE' : 'COMPLETE';
        setComplete(newIsComplete);

        async function sendUpdate(){
            try {
                const response = await fetch("http://localhost:3001/todo/" + id, {
                    method : 'PATCH',
                    headers : {'Content-Type': 'application/json'},
                    body: JSON.stringify({
                        state: newIsComplete
                    })
                });
        
                const data = await response.json();

                console.log(`received update`, data);

                setComplete(data.state);
                setDescription(data.description);

            } catch(error){
                console.log("could not update task");
                console.log(error);
            }
        }  
        sendUpdate();
    }
  
    return (
        <Row>
            <Col xs={2} lg={1}>
                <input type="checkbox" checked={isComplete === 'COMPLETE'} onChange={handleCheckboxClick}></input>
            </Col>
            <Col xs={5} lg={9}>
                {
                    isEditing ?
                    <>
                        <Form.Group controlId='descriptionInput'>
                            <Form.Control required type="text"
                                value={descriptionInput} 
                                onChange={(e) => setDescriptionInput(e.target.value)}
                            />
                        </Form.Group>
                    </>
                    :
                    <>
                        <p style={descriptionStyle}>{_description}</p>
                    </>
                }
                              
            </Col>
            <Col xs={5} lg={2}>
                {
                    isEditing ?
                    <>                        
                        <Button className='m-1' onClick={() => {saveChanges()}}>Save</Button>
                        <Button className='m-1' onClick={() => {discardChanges()}}>Discard</Button>
                    </>
                    :
                    <>
                        <Button className='m-1' onClick={() => {enableEditing()}}>Edit</Button>
                        <Button className='m-1' onClick={() => {deleteItem()}}>Delete</Button>
                    </>
                }
            </Col>
        </Row>
    );
}

export default TaskItem;