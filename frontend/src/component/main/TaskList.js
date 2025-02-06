import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Button, ButtonGroup, Form, InputGroup } from 'react-bootstrap';
import TaskItem from './TaskItem';

function TaskList() {
    const [listData, setListData] = useState([]);
    
    useEffect(() => {
        console.log(`asking list`);

        async function fetchData(){
            try {
                const response = await fetch("http://localhost:3001/todos", {
                    method : 'GET',
                    headers : {'Content-Type': 'application/json'}
                });
        
                const data = await response.json();
                setListData(data);

                console.log(data);

            } catch(error){
                console.log("could not add task");
                console.log(error);
            }
        }
        fetchData();
    }, []);
  
    return (
        <Container> 
            {
                listData.map(item => {
                    return <TaskItem key={item.id} state={item.state} description={item.description}/>
                })
            }
        </Container>
    );
}

export default TaskList;