import React, { useState } from 'react';
import { Container, Row, Col, Button, ButtonGroup, Form } from 'react-bootstrap';

function TaskItem({initialState, description}) {
    const [state, setState] = useState(initialState == 'COMPLETE');
    const [textInput, setTextInput] = useState('');
  
    return (
        <Row>
            <Col>
                <input type="checkbox" checked={ state }></input>
            </Col>
            <Col>
                {description}
            </Col>
            <Col>
                <Button>Edit</Button>/
                <Button>Delete</Button>
            </Col>
        </Row>
    );
}

export default TaskItem;