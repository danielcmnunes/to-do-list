import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useState, useEffect, useContext } from 'react';
import { Container, Row, Button, ButtonGroup } from 'react-bootstrap';
import LoginScreen from './component/login/LoginScreen.js';
import MainScreen from './component/main/MainScreen.js';
import { LoginContext } from './component/LoginContext.js';

function App() {
	const [loggedIn, setLoggedIn] = useState(false);

	useEffect(()=> {
		
	});

	return (
		<div className="App">
		<Container>
			<LoginContext.Provider value={{loggedIn, setLoggedIn}}>
					{ !loggedIn ?
					<>
						<LoginScreen />
					</>
					:
					<>
						<MainScreen/>
					</>
					}
			</LoginContext.Provider>
		</Container>
		</div>
	);
}

export default App;
