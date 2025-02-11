import React, { useState, useContext, useEffect } from 'react';
import { Button, Spinner, Form, FloatingLabel } from 'react-bootstrap';
import '/node_modules/bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

import { AuthContext } from '../context/AuthContext.js';

import FeedbackMessage from '../util/FeedbackMessage';

function Login() {
    const {setToken, setLoggedIn} = useContext(AuthContext);

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
  
    const [isLoggingIn, setLoggingIn] = useState(false);

    const [successMessage, setSuccessMessage] = useState('');
    const [failMessage, setFailMessage] = useState(false);

    const SUCCESS_DURATION = 2000;

    
    useEffect(() => {
        setUsername("daniel");
        setPassword("UhIjbciLEjVS");
        console.log("test: auto fill");
    }, []);


    const attemptLogin = async (e) => {
        e.preventDefault();
        setLoggingIn(true);
    
        try {
            const response = await fetch("http://localhost:3001/login", {
                method : 'POST',
                headers : {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    'username': username,
                    'password': password
                })
            });
    
            const data = await response.json();

            if(data.token){
                setLoggingIn(false);                
                setToken(data.token);
                setSuccessMessage('Logged in.');
                
                setTimeout(() => {
                    setLoggedIn(true);
                }, SUCCESS_DURATION);
            }

            

        } catch(error){
            setLoggingIn(false);
            setFailMessage('Login failed.');
            console.log(error);
        }
    }

    return(
    <>        
        <Form onSubmit={attemptLogin}>
            <FloatingLabel controlId="username" label="Username" className="mb-3">
                <Form.Control required type="text" value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
            </FloatingLabel>
            <FloatingLabel controlId="password" label="Password" className="mb-3">
                <Form.Control required type="password" value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
            </FloatingLabel>
            <Button className='w-100 mb-3' type="submit">Login</Button>

            <Spinner className={isLoggingIn ? "d-block my-3" : "d-none"} animation="border" variant="primary" />
            <FeedbackMessage variant="success" message={successMessage} duration={SUCCESS_DURATION}/>
            <FeedbackMessage variant="warning" message={failMessage}/>
        </Form>
    </>
    );
}
export default Login;