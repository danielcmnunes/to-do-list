import React, { useState, useContext, useRef } from 'react';
import { Row, Spinner, Form, FloatingLabel, Button } from 'react-bootstrap';
import '/node_modules/bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { AuthContext } from '../context/AuthContext';
import FeedbackMessage from '../util/FeedbackMessage';
import PasswordStrengthBar from 'react-password-strength-bar';

function Register() {
    const {setToken, setLoggedIn} = useContext(AuthContext);

    const [username_registration, setUsername] = useState('');
    const [email_registration, setEmail] = useState('');
    const [password_registration, setPassword] = useState('');
  
    const [isRegistering, setRegistering] = useState(false);

    const feedbackMessage = useRef(null);
    
    const SUCCESS_DURATION = 4000;
    const MINIMUM_PASSWORD_SCORE = 2;
    const MINIMUM_PASSWORD_LENGTH = 8;

    const [passwordScore, setPasswordScore] = useState(0);

    const attemptRegister = async (e) => {
        e.preventDefault();
        feedbackMessage.current.hide();

        if(password_registration.length < MINIMUM_PASSWORD_LENGTH){
            feedbackMessage.current.show('warning', 'Password must be at least 8 characters long.');
            return;
        }

        const usernameRegex = /^[a-zA-Z0-9\-_]+$/;
        if (!usernameRegex.test(username_registration)) {

            feedbackMessage.current.show('warning', 'Username can only contain letters and numbers (no spaces or symbols).');
            return;
        } 

        if(passwordScore < MINIMUM_PASSWORD_SCORE){
            feedbackMessage.current.show('warning', 'Please provide a stronger password.');
            return;
        }
        setRegistering(true);
    
        try {
            const response = await fetch("http://localhost:3001/users", {
                method : 'POST',
                headers : {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    'username': username_registration,                    
                    'email': email_registration,
                    'password': password_registration
                })
            });
    
            const data = await response.json();
            setToken(data.token);

            setRegistering(false);
            feedbackMessage.current.show('success', 'Registration completed! Logged in.');

            setTimeout(() => {
                setLoggedIn(true);
            }, SUCCESS_DURATION);

        } catch(error){
            setRegistering(false);
            feedbackMessage.current.show('warning', 'Registration failed.');
            console.log(error);
        }
    }   

    return(
    <>
    <Row>
        
    </Row>
        <Form onSubmit={attemptRegister}>
            <FloatingLabel controlId="username_registration" label="Username" className="mb-3">
                <Form.Control required type="text" value={username_registration}
                    onChange={(e) => setUsername(e.target.value)}
                />
            </FloatingLabel>
            <FloatingLabel controlId="email_registration" label="Email address" className="mb-3">
                <Form.Control required type="text" value={email_registration}
                    onChange={(e) => setEmail(e.target.value)}
                />
            </FloatingLabel>
            <FloatingLabel controlId="password_registration" label="Password" className="mb-3">
                <Form.Control required type="password" value={password_registration}
                    onChange={(e) => setPassword(e.target.value)}
                />
            </FloatingLabel>
            <PasswordStrengthBar password={password_registration} minLength={MINIMUM_PASSWORD_LENGTH} 
                onChangeScore={(score) => { setPasswordScore(score); }}/>

            <Button className='w-100 mb-3' type="submit">Register</Button>

            <Row className='justify-content-center'>
                <Spinner className={isRegistering ? "d-block mt-3" : "d-none"} animation="border" variant="primary" />
                <FeedbackMessage ref={feedbackMessage} />
            </Row>
        </Form>
    </>
    );
}
export default Register;