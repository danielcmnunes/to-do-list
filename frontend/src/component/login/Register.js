import React, { useState, useEffect, useContext } from 'react';
import { Container, Card, Row } from 'react-bootstrap';

import Spinner from 'react-bootstrap/Spinner';
import Alert from 'react-bootstrap/Alert';
import '/node_modules/bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';


function Register() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
  
    const [isRegistering, setRegistering] = useState(false);

    const [successMessage, setSuccessMessage] = useState('');
    const [failMessage, setFailMessage] = useState(false);

    useEffect(() => {
        setUsername("John");
        setEmail("test@example.com");
        setPassword("!#$&%/(=)?");
        console.log("test: auto fill");
    }, []);

    const attemptRegister = async (e) => {
        setRegistering(true);

        try {
          e.preventDefault();      
        } catch (error) {
          console.log("called directly");      
        }
    
        let data = {
            username: username,
            email: email,
            password: password
        }

        // fetch("localhost/login", {
        //     method : 'POST',
        //     headers : {'Content-Type': 'application/json'},
        //     body : JSON.stringify(data)
        // })
        // .then((response) => response.json())
        // .then((data) => {    
        //   if(data.success){
        //     // localStorage.setItem("jwt", data.token);


    
        //         setSuccessMessage('Logged in.');
        //         setSuccessAlert(true);

        //     } else {
        //         setFailMessage('Login failed.');
        //         setFailAlert(true);
        //     }      
        //     setRegistering(false);
        // })
        // .catch((error) => {
        //     setRegistering(false);
        //     setFailMessage('Login failed.');
        //     setFailAlert(true);
        // });
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
                <button type="submit">Log in</button>
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