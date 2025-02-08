import React, { useState, useEffect, useContext } from 'react';
import { Container, Row, Col } from 'react-bootstrap';

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
            <Row className='mb-3'>
                <Col xs={12}>
                    <i className="bi bi-card-checklist" style={{'font-size': '25vw'}}></i>
                    <p><strong>TO-DO List App</strong></p>
                </Col>
            </Row>
            <Tabs defaultActiveKey="login" id="uncontrolled-tab-example" className="mb-3" fill>
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