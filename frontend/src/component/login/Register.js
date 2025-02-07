import React, { useState, useEffect, useContext } from 'react';
import { Container, Card, Row } from 'react-bootstrap';
import Spinner from 'react-bootstrap/Spinner';
import Alert from 'react-bootstrap/Alert';
import '/node_modules/bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { AuthContext } from '../context/AuthContext';


function Register() {
    const {token, setToken, isLoggedIn, setLoggedIn} = useContext(AuthContext);

    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
  
    const [isRegistering, setRegistering] = useState(false);

    const [successMessage, setSuccessMessage] = useState('');
    const [failMessage, setFailMessage] = useState(false);

    useEffect(() => {
        setUsername("Joaozinho");
        setEmail("test@example.com");
        setPassword("654_+321");
        console.log("test: auto fill");
    }, []);

    const attemptRegister = async (e) => {
        e.preventDefault();
        setRegistering(true);
    
        try {
            const response = await fetch("http://localhost:3001/users", {
                method : 'POST',
                headers : {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    'username': username,                    
                    'email': email,
                    'password': password
                })
            });
    
            const data = await response.json();
            setToken(data.token);

            setSuccessMessage('Registration completed! Logged in.');
            setRegistering(false);
            
            setTimeout( () => {
                setLoggedIn(true);
            }, 2000);

        } catch(error){
            setRegistering(false);
            setFailMessage('Registration failed.');
            console.log(error);
        }
    }   

    return(
    <>        
        <form onSubmit={attemptRegister}>
            <div className="mb-3">
                <input type="text" placeholder="Username" required value={username} onChange={(e) => setUsername(e.target.value)}/>
            </div>
            <div className="mb-3">
                <input type="email" placeholder="Email" required value={email} onChange={(e) => setEmail(e.target.value)}/>
            </div>
            <div className="mb-3">
            <input type="password" placeholder="Password" required value={password} onChange={(e) => setPassword(e.target.value)}/>
            </div>
            <div className="mb-3">
                <button type="submit">Register</button>
            </div>
            <div className="mb-3">                    
                <Spinner className={isRegistering ? "d-block mt-3" : "d-none"} animation="border" variant="primary" />
                <Alert variant="success" className={successMessage.length > 0 ? "d-block mt-3" : "d-none"}>{successMessage}</Alert>					
                <Alert variant="warning" className={failMessage.length > 0 ? "d-block mt-3" : "d-none"}>{failMessage}</Alert>
            </div>
        </form>
    </>
    );
}
export default Register;