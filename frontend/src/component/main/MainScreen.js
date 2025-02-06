import React, { useState, useEffect, useContext } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';

import '/node_modules/bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

import { LoginContext } from '../LoginContext.js';
import TaskInput from './TaskInput.js';
import TaskList from './TaskList.js';
import {TodoListContext} from '../TodoListContext.js';

function MainScreen() {
    const {loggedIn, setLoggedIn} = useContext(LoginContext);
    const [items, setItems] = useState([]);

    // useEffect(() => {

    // });

    return(
    <TodoListContext.Provider value={{items, setContextList: setItems}}>
        <Container>
            <Row className='d-flex justify-content-between'>
                <Col>
                    <Button variant='primary' className='' onClick={() => { }}> 
                        <i className="bi bi-person-circle"></i>
                    </Button>
                </Col>
                <Col>                
                    <Button variant='primary' onClick={() => { setLoggedIn(false) }}> 
                        <i className="bi bi-box-arrow-right"></i>
                    </Button>
                </Col>
            </Row>            
            <Row> <TaskInput/> </Row>
            <Row> <TaskList/> </Row>
        </Container>

    </TodoListContext.Provider>
    );
}
export default MainScreen;