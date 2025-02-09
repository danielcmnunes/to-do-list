import React, { useEffect, useState, useContext } from 'react';
import { Row, Col, Button, Form, Collapse } from 'react-bootstrap';
import {TodoListContext} from '../context/TodoListContext.js';
import { AuthContext } from '../context/AuthContext.js';

function TaskItem({id, state, description}) {
    const {items, setContextList} = useContext(TodoListContext);
    const {token } = useContext(AuthContext);

    const [isComplete, setComplete] = useState(state);

    const [_description, setDescription] = useState(description);
    const [descriptionInput, setDescriptionInput] = useState(description);

    const [isEditing, setEditing] = useState(false);
    const [descriptionStyle, setDescriptionStyle] = useState({textDecorationLine: 'none'});

    const [open, setOpen] = useState(true);
    

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
                    headers : {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer '+ token
                    },
                    body: JSON.stringify({
                        description: descriptionInput
                    })
                });
        
                const data = await response.json();
                console.log(data);

                //update context
                const newItems = items.map(item => {
                    if(item.id === id){
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
                    headers : {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer '+ token
                    }
                });
        
                const data = await response.json();

                console.log(`received delete`, data);

                if(response.status === 200){
                    setOpen(false);
                    
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

    const updateContext = () => {
        const newItems = items.filter(item => item.id !== id);
        setContextList(newItems);
    }

    const handleCheckboxClick = (e) => {
        
        const newIsComplete = isComplete === 'COMPLETE' ? 'INCOMPLETE' : 'COMPLETE';
        setComplete(newIsComplete);

        async function sendUpdate(){
            try {
                const response = await fetch("http://localhost:3001/todo/" + id, {
                    method : 'PATCH',
                    headers : {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer '+ token
                    },
                    body: JSON.stringify({
                        state: newIsComplete
                    })
                });
        
                const data = await response.json();

                console.log(`received update`, data);

                //update context
                const newItems = items.map(item => {
                    if(item.id === id){
                        return {
                            ...item,
                            state: newIsComplete
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
        <Collapse in={open} dimension='height' unmountOnExit={true} onExited={updateContext}>
        <Row className='bg-light border-bottom mx-1'>
            <Col xs={1} className='d-table align-middle'>
                <div className='d-table-cell align-middle'>
                    <input type="checkbox" checked={isComplete === 'COMPLETE'} onChange={handleCheckboxClick}></input>
                </div>
            </Col>
            <Col sm={6} md={8} lg={9} className='d-table align-middle'>
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
                    <div className='d-table-cell align-middle'>
                        <span style={descriptionStyle}>{_description}</span>
                    </div>                  
                }                            
            </Col>
            <Col sm={5} md={3} lg={2} className='mr-0'>
                {
                    isEditing ?
                    <>                        
                        <Button variant='success' className='m-1' onClick={() => {saveChanges()}}>
                            <i className="bi bi-floppy"></i>
                        </Button>
                        <Button variant='secondary' className='m-1' onClick={() => {discardChanges()}}>
                            <i className="bi bi-x"></i>
                        </Button>
                    </>
                    :
                    <>
                        <Button className='m-1' disabled={ isComplete === 'COMPLETE' } onClick={() => {enableEditing()}}>
                            <i className="bi bi-pencil-square"></i>
                        </Button>
                        <Button variant='danger' className='m-1' onClick={() => {deleteItem()}}>
                            <i className="bi bi-trash"></i>
                        </Button>
                    </>
                }
            </Col>
        </Row>
        </Collapse>
    );
}

export default TaskItem;