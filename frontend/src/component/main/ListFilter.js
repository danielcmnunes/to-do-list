import React, { useEffect, useState, useContext } from 'react';
import { Container, Row, Col, Button, ButtonGroup, Form, InputGroup } from 'react-bootstrap';
import TaskItem from './TaskItem';
import { TodoListDisplayContext } from '../context/TodoListDisplayContext.js';

function ListFilter() {
    const {hideCompleted, setHideCompleted} = useContext(TodoListDisplayContext);

    const handleCheckboxClick = (e) => {
        setHideCompleted(!hideCompleted);
    };

    return (
        <Container className='d-flex justify-content-start'> 
            <label className='me-3'>Hide completed</label>
            <input type="checkbox" checked={hideCompleted} onChange={handleCheckboxClick}></input>
        </Container>
    );
}

export default ListFilter;