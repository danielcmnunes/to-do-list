import React, { useState, forwardRef, useImperativeHandle } from 'react';
import { Alert } from 'react-bootstrap';

const FeedbackMessage = forwardRef( ({duration = 3000}, ref) =>{
    const [isOpen, setOpen] = useState(false);
    const [message, setMessage] = useState(undefined);
    const [variant, setVariant] = useState(undefined);

    const show = (variant, message) => {
        setVariant(variant);
        setMessage(message);
        setOpen(true);

        let timeout = duration - 500; //0.4s fade out
        if(timeout < 0){
            timeout = 1000;
        }

        const timerId = setTimeout(() => {
            console.log("hide!");
            setOpen(false);
        }, timeout);

        return () => clearTimeout(timerId);
    }

    const hide = () => {
        setOpen(false);
    }

    useImperativeHandle(ref, () => ({
        show, hide
    }));

    return(        
        <div className={'feedback-message ' + (isOpen ? 'feedback-fade-in' : 'feedback-fade-out')}>
            <Alert variant={variant}>{message}</Alert>
        </div>
    );
});

export default FeedbackMessage;