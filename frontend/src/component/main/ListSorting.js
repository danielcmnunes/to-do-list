import React, { useEffect, useState, useContext } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { TodoListDisplayContext } from '../TodoListDisplayContext.js';

function ListSorting() {
    const {sortingOrder, setSortingOrder} = useContext(TodoListDisplayContext);    
    /*
        default - by creation date
        asc - A to Z
        desc - Z to A
    */
    const sortingModes = ['default', 'asc', 'desc']
    const [sortingIndex, setIndex] = useState(0);

    const handleButtonClick = () => {
        const newSortingMode = (sortingIndex < sortingModes.length -1) ? sortingIndex+ 1 : 0;
        setIndex(newSortingMode);
        setSortingOrder(sortingModes[newSortingMode]);
    };

    return (
        <Container className='d-flex justify-content-start'>
            <Button onClick={() => { handleButtonClick() }}>
                {
                    sortingIndex === 0 ?
                    <i className="bi bi-funnel"></i> 
                    :
                    (sortingIndex === 1 ? 
                        <i className="bi bi-sort-alpha-up"></i> 
                        :
                        <i className="bi bi-sort-alpha-down"></i> 
                    )
                }
            </Button>
        </Container>
    );
}

export default ListSorting;