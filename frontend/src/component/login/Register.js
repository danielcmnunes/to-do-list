import React, { useState, useEffect, useContext } from 'react';
import { Container, Card, Row, Spinner, Alert, Form, FloatingLabel, Button } from 'react-bootstrap';
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

    const [successMessage, setSuccessMessage] = useState('');
    const [failMessage, setFailMessage] = useState(false);
    
    const SUCCESS_DURATION = 4000;

    const [passwordScore, setPasswordScore] = useState(0);

    useEffect(() => {
        setUsername("Joaozinho");
        setEmail("test@example.com");
        setPassword("654_+321");
        console.log("test: auto fill");
    }, []);

    const attemptRegister = async (e) => {
        e.preventDefault();

        if(passwordScore < 4){
            setFailMessage('Please provide a stronger password.');
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
            setSuccessMessage('Registration completed! Logged in.');

            setTimeout(() => {
                setLoggedIn(true);
            }, SUCCESS_DURATION);

        } catch(error){
            setRegistering(false);
            setFailMessage('Registration failed.');
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
            <PasswordStrengthBar password={password_registration} minLength={8} 
                onChangeScore={(score) => { setPasswordScore(score); }}/>

            <Button className='w-100 mb-3' type="submit">Register</Button>

            <Spinner className={isRegistering ? "d-block mt-3" : "d-none"} animation="border" variant="primary" />
            <FeedbackMessage variant="success" message={successMessage} duration={SUCCESS_DURATION}/>
            <FeedbackMessage variant="warning" message={failMessage}/>
        </Form>
    </>
    );
}
export default Register;