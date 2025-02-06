import React, { useEffect, useState, useContext } from 'react';
import { Container, Row, Col, Button, ButtonGroup, Form } from 'react-bootstrap';
import {TodoListContext} from '../TodoListContext.js';

function TaskItem({id, state, description}) {
    const {items, setContextList} = useContext(TodoListContext);

    const [_id, setId] = useState(id);

    const [isComplete, setComplete] = useState(state);

    const [_description, setDescription] = useState(description);
    const [descriptionInput, setDescriptionInput] = useState(description);

    const [isEditing, setEditing] = useState(false);
    const [descriptionStyle, setDescriptionStyle] = useState({textDecorationLine: 'none'});
    

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

                //update context
                const newItems = items.map(item => {
                    if(item.id === _id){
                        return {
                            ...item,
                            description: descriptionInput
                        }
                    } else {
                        return item;
                    }
                });
                setContextList(newItems);
                setDescription(data.description);

                console.log(items);

            } catch(error){
                console.log("could not update task");
                console.log(error);
                setDescriptionInput(_description);
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

                if(response.status === 200){
                    //update context
                    const newItems = items.filter(item => item.id !== _id);
                    setContextList(newItems);
                    
                    console.log(`TODO: deleted; implement feedback behavior`);    
                } else if(response.status === 404){
                    console.log(`TODO: not found; implement feedback behavior`);    
                } else {
                    console.log("TODO: failed; implement feedback behavior");
                }
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

                //update context
                const newItems = items.map(item => {
                    if(item.id === _id){
                        return {
                            ...item,
                            state: isComplete
                        }
                    } else {
                        return item;
                    }
                });
                setContextList(newItems);

                setComplete(data.state);
                console.log(items);

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
            <Col xs={6} lg={9}>
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
            <Col xs={4} lg={2}>
                {
                    isEditing ?
                    <>                        
                        <Button className='m-1' onClick={() => {saveChanges()}}>
                            <i className="bi bi-floppy"></i>
                        </Button>
                        <Button className='m-1' onClick={() => {discardChanges()}}>
                            <i className="bi bi-x"></i>
                        </Button>
                    </>
                    :
                    <>
                        <Button className='m-1' onClick={() => {enableEditing()}}>
                            <i className="bi bi-pencil-square"></i>
                        </Button>
                        <Button className='m-1' onClick={() => {deleteItem()}}>
                            <i className="bi bi-trash"></i>
                        </Button>
                    </>
                }
            </Col>
        </Row>
    );
}

export default TaskItem;