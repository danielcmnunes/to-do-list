import React, { useState, useEffect, useContext } from 'react';
import { Container, Card, Row } from 'react-bootstrap';

import Spinner from 'react-bootstrap/Spinner';
import Alert from 'react-bootstrap/Alert';
import '/node_modules/bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

import { AuthContext } from '../context/AuthContext.js';

function Login() {
    const {token, setToken, isLoggedIn, setLoggedIn} = useContext(AuthContext);

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
  
    const [isLoggingIn, setLoggingIn] = useState(false);

    const [successMessage, setSuccessMessage] = useState('');
    const [failMessage, setFailMessage] = useState(false);

    useEffect(() => {
        setUsername("daniel");
        setPassword("123");
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
            setToken(data.token);

            setSuccessMessage('Logged in.');
            setLoggingIn(false);
            
            setLoggedIn(true);

        } catch(error){
            setLoggingIn(false);
            setFailMessage('Login failed.');
            console.log(error);
        }
    }

    return(
    <>        
        <form onSubmit={attemptLogin}>
            <div className="mb-3">
                <input type="text" placeholder="Username" required value={username} onChange={(e) => setUsername(e.target.value)}/>
            </div>
            <div className="mb-3">
            <input type="password" placeholder="Password" required value={password} onChange={(e) => setPassword(e.target.value)}/>
            </div>
            <div className="mb-3">
                <button type="submit">Log in</button>
            </div>
            <div className="mb-3">                    
                <Spinner className={isLoggingIn ? "d-block mt-3" : "d-none"} animation="border" variant="primary" />
                <Alert variant="success" className={successMessage.length > 0 ? "d-block mt-3" : "d-none"}>{successMessage}</Alert>					
                <Alert variant="warning" className={failMessage.length > 0 ? "d-block mt-3" : "d-none"}>{failMessage}</Alert>
            </div>
        </form>
    </>
    );
}
export default Login;