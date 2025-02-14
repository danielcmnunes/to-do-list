import React, { useState, useContext, useRef } from 'react';
import { Container, Row, Button, ButtonGroup } from 'react-bootstrap';

import '/node_modules/bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

import { TodoListContext } from '../context/TodoListContext.js';
import { TodoListDisplayContext } from '../context/TodoListDisplayContext.js';
import { AuthContext } from '../context/AuthContext.js';
import TaskInput from './TaskInput.js';
import TaskList from './TaskList.js';
import ListFilter from './ListFilter.js';
import Details from '../details/Details.js';
import FeedbackMessage from '../util/FeedbackMessage.js';

function MainScreen() {
    const [items, setItems] = useState([]);
    const [hideCompleted, setHideCompleted] = useState(false);
    const [sortingOrder, setSortingOrder] = useState('default');
    const {setToken, setLoggedIn} = useContext(AuthContext);
    const [showDetails, setShowDetails] = useState(false);
    const [failMessage, setFailMessage] = useState('');
    
    const feedbackMessage = useRef();

    const logout = async () => {
        setLoggedIn(false);
        setToken();
    };

    const handleSwitchDetails = () => {
        const newValue = !showDetails;
        setFailMessage('');
        setShowDetails(newValue);
        console.log(showDetails);
    }


    return(
    <TodoListContext.Provider value={{items, setContextList: setItems, failMessage, setFailMessage}}>
        <TodoListDisplayContext.Provider value={{hideCompleted, setHideCompleted, sortingOrder, setSortingOrder }}>
            <Container>
                <Row className='d-flex justify-content-between my-3 ml-0 mr-0'>
                    <ButtonGroup>
                        <Button variant='primary' className='' onClick={() => { handleSwitchDetails() }} disabled={showDetails} > 
                            <label className='me-1'>Details</label>
                            <i className="bi bi-person-circle"></i>
                        </Button>
                        <Button onClick={() => { handleSwitchDetails() }} disabled={!showDetails} >
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
                    <Row className='mt-3'> <TaskInput feedback={feedbackMessage}/> </Row>
                    <Row className='mt-3'> <TaskList/> </Row>
                    <Row className='mt-3'> <ListFilter/></Row>
                    <Row>
                        <FeedbackMessage variant="danger" message={failMessage} duration={3000} />
                        <FeedbackMessage ref={feedbackMessage}></FeedbackMessage>
                    </Row>
                </>
                }
            </Container>
        </TodoListDisplayContext.Provider>
    </TodoListContext.Provider>
    );
}
export default MainScreen;