import React, { useState, useEffect, useContext } from 'react';
import { Container, Row, Col, Button, ButtonGroup } from 'react-bootstrap';

import '/node_modules/bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

import { LoginContext } from '../LoginContext.js';
import { TodoListContext } from '../TodoListContext.js';
import { TodoListDisplayContext } from '../TodoListDisplayContext.js';
import TaskInput from './TaskInput.js';
import TaskList from './TaskList.js';
import ListFilter from './ListFilter.js';
import ListSorting from './ListSorting.js';

function MainScreen() {
    const {loggedIn, setLoggedIn} = useContext(LoginContext);
    const [items, setItems] = useState([]);
    const [hideCompleted, setHideCompleted] = useState(false);
    const [sortingOrder, setSortingOrder] = useState('default');

    return(
    <TodoListContext.Provider value={{items, setContextList: setItems}}>
        <TodoListDisplayContext.Provider value={{hideCompleted, setHideCompleted, sortingOrder, setSortingOrder }}>
            <Container>
                <Row className='d-flex justify-content-between mb-3'>
                    <ButtonGroup>
                        <Button variant='primary' className='' onClick={() => { }}> 
                            <label className='me-1'>Profile</label>
                            <i className="bi bi-person-circle"></i>
                        </Button>
                        <Button disabled>
                            To Do App
                        </Button>         
                        <Button variant='primary' onClick={() => { setLoggedIn(false) }}> 
                            <label className='me-1'>Logout</label>
                            <i className="bi bi-box-arrow-right"></i>
                        </Button>
                    </ButtonGroup>
                </Row>            
                <Row> <ListSorting/> </Row>
                <Row> <TaskInput/> </Row>
                <Row> <TaskList/> </Row>
                <Row> <ListFilter/></Row>
            </Container>
        </TodoListDisplayContext.Provider>
    </TodoListContext.Provider>
    );
}
export default MainScreen;