import React, { useState, useEffect } from 'react';
import { Alert } from 'react-bootstrap';


function FeedbackMessage({variant, message, duration}){
    const [isOpen, setOpen] = useState(false);

    useEffect(() => {
        console.log("message or duration changed:", message, duration);
        if(message){
            setOpen(true);

            let time_out = duration - 2000; // the transition takes 0.4s

            if(time_out < 0){
                time_out = duration;
            }

            console.log(duration, time_out);

            const timerId = setTimeout(function(){
                console.log("hide!!!");
                setOpen(false);
            }, duration);

            return () => clearTimeout(timerId);
        }
    }, [message, duration]);

    return(        
        <div className={'feedback-message ' + (isOpen ? 'feedback-fade-in' : 'feedback-fade-out')}>
            <Alert variant={variant}>{message}</Alert>
        </div>
    );
};

export default FeedbackMessage;