import React, { useState, useEffect } from 'react';
import { Alert } from 'react-bootstrap';

function FeedbackMessage({variant, message, duration}){
    const DEFAULT_DURATION = 4000;
    const [isOpen, setOpen] = useState(false);

    useEffect(() => {
        if(message){
            setOpen(true);

            const timerId = setTimeout(() => {
                setOpen(false);
            }, duration ? duration : DEFAULT_DURATION);

            return () => clearTimeout(timerId);
        }
    }, [message]);

    return(        
        <div className={'feedback-message ' + (isOpen ? 'feedback-fade-in' : 'feedback-fade-out')}>
            <Alert variant={variant}>{message}</Alert>
        </div>
    );
};

export default FeedbackMessage;