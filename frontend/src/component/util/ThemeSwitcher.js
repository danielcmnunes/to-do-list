import React, { useEffect, useState } from 'react';
import { Form, Row, Col } from 'react-bootstrap';
import { useCookies } from 'react-cookie';

function ThemeSwitcher(){
    const [theme, setTheme] = useState(undefined);
    const [cookie, setCookie] = useCookies(['theme-choice']);

    useEffect( () => {
        if(cookie.theme === 'dark'){
            switchTheme('dark');
        } else {
            switchTheme('light');
        }
    }, []);

    const switchTheme = (newTheme) => {
        setTheme(newTheme);
        document.documentElement.setAttribute('data-bs-theme', newTheme);
        setCookie('theme', newTheme);
    }

    const handleClick = () => {
        if (theme === 'light') {
            switchTheme('dark');
        } else {
            switchTheme('light');
        }
    }

    return(
        <Row className='mt-1'>
            <Col xs={1}>
                <Form>
                    <Form.Check
                        type="switch"
                        onClick={handleClick}
                        label="Light/Dark"
                    />
                </Form>
            </Col>
        </Row>
    );
};

export default ThemeSwitcher;