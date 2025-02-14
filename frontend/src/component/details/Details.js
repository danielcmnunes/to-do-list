import React, { useEffect, useState, useContext, useRef } from 'react';
import { Container, Row, Col, Button, Form, Spinner, FloatingLabel } from 'react-bootstrap';
import { AuthContext } from '../context/AuthContext';
import FeedbackMessage from '../util/FeedbackMessage';
import PasswordStrengthBar from 'react-password-strength-bar';

function Details() {
    const {token} = useContext(AuthContext);

    const [isEditing, setEditing] = useState(false);
    const [isUpdating, setUpdating] = useState(false);

    const feedbackMessage = useRef(null);

    const [email, setEmail] = useState('');

    const [usernameInput, setUsernameInput] = useState('');
    const [emailInput, setEmailInput] = useState('');
    const [passwordInput, setPasswordInput] = useState('');    
    const [passwordConfirmationInput, setPasswordConfirmationInput] = useState('');
    
    const [passwordScore, setPasswordScore] = useState(0);

    const MINIMUM_PASSWORD_SCORE = 2;

    useEffect(() => {
        async function getDetails(){
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

                setUsernameInput(data.username);

                setEmail(data.email);
                setEmailInput(data.email);

            } catch(error){
                console.log("could not get details");
                console.log(error);
            }
        };  
        getDetails();
    }, [token]);

    const enableEditing = () => {
        setEditing(true);
    };

    const discardChanges = () => {
        setEditing(false);
    };

    const saveChanges = () => {
        setUpdating(true);
        feedbackMessage.current.hide();


        async function sendUpdate(){
            const payload = {};

            if(passwordInput !== ''){
                if(passwordScore < MINIMUM_PASSWORD_SCORE){
                    setUpdating(false);
                    feedbackMessage.current.show('warning', 'Please provide a stronger password.');
                    return;
                }

                if(passwordInput === passwordConfirmationInput){
                    payload.password = passwordInput;
                } else {
                    setUpdating(false);
                    feedbackMessage.current.show('warning', 'Confirmation password doesn\'t match new password.');
                    return;
                }
            }

            if(emailInput !== email){
                payload.email = emailInput;
            }

            if(Object.keys(payload).length === 0){
                setUpdating(false);                
                feedbackMessage.current.show('secondary', 'Nothing to update.');
                return;
            }
            
            setEditing(false);

            try {
                const response = await fetch("http://localhost:3001/me", {
                    method : 'PATCH',
                    headers : {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer '+ token
                    },
                    body: JSON.stringify(payload)
                });

                setUpdating(false);
        
                const data = await response.json();
                
                setUsernameInput(data.username);

                setEmail(data.email);
                setEmailInput(data.email);
                feedbackMessage.current.show('success', 'Details edited succesfully!');
                
            } catch(error){
                console.log("could not update task");
                console.log(error);
            }
        }
        sendUpdate();
    }

    return (
        <Container>
            <Row className='justify-content-center'>
                <Col sm={8} md={6} lg={4}>
                <Row className="mb-3">
                    <strong>Account Details</strong>
                </Row>
                <Form>
                    <FloatingLabel controlId="usernameInput" label="Username" className="mb-3">
                        <Form.Control required type="text" value={usernameInput} disabled
                            onChange={(e) => setUsernameInput(e.target.value)}
                        />
                    </FloatingLabel>
                    <FloatingLabel controlId="emailInput" label="Email address" className="mb-3">
                        <Form.Control required type="text" value={emailInput} disabled={!isEditing}
                            onChange={(e) => setEmailInput(e.target.value)}
                        />
                    </FloatingLabel>
                    <FloatingLabel controlId="passwordInput" label="New Password" className="mb-3">
                        <Form.Control required type="password" value={passwordInput} className="mb-3" disabled={!isEditing}
                            onChange={(e) => setPasswordInput(e.target.value)}
                        />
                    </FloatingLabel>
                    {
                    isEditing ?
                        <>
                            <PasswordStrengthBar password={passwordInput} minLength={8} 
                                onChangeScore={(score) => { setPasswordScore(score); }}/>
                                
                            <FloatingLabel controlId="passwordInput" label="Confirm the new password" className="mb-3">
                                <Form.Control required type="password" value={passwordConfirmationInput} className="mb-3" disabled={!isEditing}
                                    onChange={(e) => setPasswordConfirmationInput(e.target.value)}
                                />
                            </FloatingLabel>
                        </>
                    :
                        <></>
                    }                    
                </Form>                    
                {
                isEditing ?
                    <Row>
                        <Col>
                            <Button variant='success' className='m-1 w-100' onClick={() => {saveChanges()}}>
                                <i className="bi bi-floppy"></i></Button>
                        </Col>
                        <Col>
                            <Button variant='secondary' className='m-1 w-100' onClick={() => {discardChanges()}}>
                                <i className="bi bi-x"></i></Button>
                        </Col>                        
                    </Row>
                :
                    <Row>
                        <Col>
                            <Button className='w-100' disabled={false } onClick={() => {enableEditing()}}>
                                <i className="bi bi-pencil-square"></i></Button>
                        </Col>
                    </Row>
                }
                </Col>
            </Row>
            <Row className='mt-3 justify-content-center'>
                <Spinner className={isUpdating ? "d-block" : "d-none"} animation="border" variant="primary" />
                <FeedbackMessage ref={feedbackMessage} />
            </Row>
        </Container>
    );
}

export default Details;