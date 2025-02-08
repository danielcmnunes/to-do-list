import React, { useState, useContext } from 'react';
import { Container, Row, Button, ButtonGroup } from 'react-bootstrap';

import '/node_modules/bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

import { TodoListContext } from '../context/TodoListContext.js';
import { TodoListDisplayContext } from '../context/TodoListDisplayContext.js';
import { AuthContext } from '../context/AuthContext.js';
import TaskInput from './TaskInput.js';
import TaskList from './TaskList.js';
import ListFilter from './ListFilter.js';
import ListSorting from './ListSorting.js';
import Details from '../details/Details.js';

function MainScreen() {
    const [items, setItems] = useState([]);
    const [hideCompleted, setHideCompleted] = useState(false);
    const [sortingOrder, setSortingOrder] = useState('default');
    const {setToken, setLoggedIn} = useContext(AuthContext);
    const [showDetails, setShowDetails] = useState(false);

    const logout = async () => {
        setLoggedIn(false);
        setToken();
    };

    const handleShowDetailsClick = () => {
        const newValue = !showDetails;
        setShowDetails(newValue);
        console.log(showDetails);
    }


    return(
    <TodoListContext.Provider value={{items, setContextList: setItems}}>
        <TodoListDisplayContext.Provider value={{hideCompleted, setHideCompleted, sortingOrder, setSortingOrder }}>
            <Container>
                <Row className='d-flex justify-content-between my-3'>
                    <ButtonGroup>
                        <Button variant='primary' className='' onClick={() => { handleShowDetailsClick() }}> 
                            <label className='me-1'>Details</label>
                            <i className="bi bi-person-circle"></i>
                        </Button>
                        <Button disabled>
                            To Do App
                        </Button>         
                        <Button variant='primary' onClick={() => { logout() }}> 
                            <label className='me-1'>Logout</label>
                            <i className="bi bi-box-arrow-right"></i>
                        </Button>
                    </ButtonGroup>
                </Row>
                { 
                showDetails ?
                <>
                    <Details />
                </>
                :                
                <>
                    <Row> <ListSorting/> </Row>
                    <Row> <TaskInput/> </Row>
                    <Row> <TaskList/> </Row>
                    <Row className='mt-3'> <ListFilter/></Row>
                </>
                }
            </Container>
        </TodoListDisplayContext.Provider>
    </TodoListContext.Provider>
    );
}
export default MainScreen;