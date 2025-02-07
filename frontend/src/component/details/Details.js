import React, { useEffect, useState, useContext } from 'react';
import { Container, Row, Col, Button, ButtonGroup, Form } from 'react-bootstrap';
import { AuthContext } from '../context/AuthContext';

function Details({id, state, description}) {
    const {token } = useContext(AuthContext);
    const [isEditing, setEditing] = useState(false);
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [emailInput, setEmailInput] = useState('');
    const [passwordInput, setPasswordInput] = useState('');
    const [passwordConfirmationInput, setPasswordConfirmationInput] = useState('');

    useEffect( () => {
        async function sendUpdate(){
            try {
                const response = await fetch("http://localhost:3001/me", {
                    method : 'GET',
                    headers : {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer '+ token
                    }
                });
        
                const data = await response.json();

                console.log(`received details`, data);

                setUsername(data.username);
                setEmail(data.email);

            } catch(error){
                console.log("could not get details");
                console.log(error);
            }
        }  
        sendUpdate();
    });

    const enableEditing = () => {
        setEditing(true);
    }

    const discardChanges = () => {
        setEditing(false);
    }

    const saveChanges = () => {
        // console.log(`save`);
        // setEditing(false);

        // async function sendUpdate(){
        //     try {
        //         const response = await fetch("http://localhost:3001/todo/" + id, {
        //             method : 'PATCH',
        //             headers : {'Content-Type': 'application/json'},
        //             body: JSON.stringify({
        //                 description: descriptionInput
        //             })
        //         });
        
        //         const data = await response.json();
        //         console.log(data);

        //         //update context
        //         const newItems = items.map(item => {
        //             if(item.id === _id){
        //                 return {
        //                     ...item,
        //                     description: descriptionInput
        //                 }
        //             } else {
        //                 return item;
        //             }
        //         });
        //         setContextList(newItems);
        //         setDescription(data.description);

        //         console.log(items);

        //     } catch(error){
        //         console.log("could not update task");
        //         console.log(error);
        //         setDescriptionInput(_description);
        //     }
        // }
        // sendUpdate();
    }

    const deleteItem = () => {
        async function sendDelete(){
            try {
                // const response = await fetch("http://localhost:3001/todo/" + id, {
                //     method : 'DELETE',
                //     headers : {'Content-Type': 'application/json'}
                // });
        
                // const data = await response.json();

                // console.log(`received delete`, data);

                // if(response.status === 200){
                //     setOpen(false);
                    
                // } else if(response.status === 404){
                //     console.log(`TODO: not found; implement feedback behavior`);    
                // } else {
                //     console.log("TODO: failed; implement feedback behavior");
                // }
            } catch(error){
                console.log("could not delete task");
                console.log(error);
            }
        }  
        sendDelete();
    }

    const handleCheckboxClick = (e) => {
        
        // const newIsComplete = isComplete === 'COMPLETE' ? 'INCOMPLETE' : 'COMPLETE';
        // setComplete(newIsComplete);

        
    }
  
    return (
        <Container>
            <Row>
                {
                    isEditing ?
                    <>
                    <Form>
                        <Form.Group controlId='emailInput'>
                            <Form.Control required type="text"
                                value={emailInput} 
                                onChange={(e) => setEmailInput(e.target.value)}
                            />
                        </Form.Group>
                        <Form.Group controlId='passwordInput'>
                            <Form.Control required type="password"
                                value={passwordInput} 
                                onChange={(e) => setPasswordInput(e.target.value)}
                            />
                        </Form.Group>
                        <Form.Group controlId='passwordConfirmationInput'>
                            <Form.Control required type="password"
                                value={passwordConfirmationInput} 
                                onChange={(e) => setPasswordConfirmationInput(e.target.value)}
                            />
                        </Form.Group>
                    </Form>
                        <Button variant='success' className='m-1' onClick={() => {saveChanges()}}>
                            <i className="bi bi-floppy"></i>
                        </Button>
                        <Button variant='secondary' className='m-1' onClick={() => {discardChanges()}}>
                            <i className="bi bi-x"></i>
                        </Button>
                    </>
                    :
                    <>
                        <span className="my-2">{username}</span>
                        <span className="my-2">{email}</span>
                        <Button className='m-1' disabled={false } onClick={() => {enableEditing()}}>
                            <i className="bi bi-pencil-square"></i>
                        </Button>
                    </>
                }
            </Row>
        </Container>
    );
}

export default Details;