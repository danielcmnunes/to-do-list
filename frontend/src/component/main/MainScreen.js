import React, { useState, useEffect, useContext } from 'react';
import { Container, Row, Button, ButtonGroup } from 'react-bootstrap';

import '/node_modules/bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

import { LoginContext } from '../LoginContext.js';
import TaskInput from './TaskInput.js';
import TaskList from './TaskList.js';

function MainScreen() {
    const {loggedIn, setLoggedIn} = useContext(LoginContext);

    useEffect(() => {

    });

    return(
    <>        
        <Container>
            <ButtonGroup className=''>
                <Button onClick={() => {  }}> 
                    <i className="bi bi-person-circle"></i>
                </Button>
                <Button onClick={() => { setLoggedIn(false) }}> 
                    <i className="bi bi-box-arrow-right"></i>
                </Button>
            </ButtonGroup>
            <Row> <TaskInput/> </Row>
            <Row> <TaskList/> </Row>
        </Container>
    </>
    );
}
export default MainScreen;