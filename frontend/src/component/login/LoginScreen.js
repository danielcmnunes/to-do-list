import React, { useState, useEffect, useContext } from 'react';
import { Container, Card, Row } from 'react-bootstrap';

import Spinner from 'react-bootstrap/Spinner';
import Alert from 'react-bootstrap/Alert';
import '/node_modules/bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import Login from './Login';
import Register from './Register';

function LoginScreen() {

    return(
    <>
        <Container>
            <Tabs defaultActiveKey="login" id="uncontrolled-tab-example" className="mb-3">
                <Tab eventKey="login" title="Login">
                    <Login/>
                </Tab>
                <Tab eventKey="register" title="Register">
                    <Register/>
                </Tab>
            </Tabs>
            
        </Container>
    </>
    );
}
export default LoginScreen;