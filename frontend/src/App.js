import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container } from 'react-bootstrap';
import React, { useState } from 'react';
import { AuthContext } from './component/context/AuthContext.js';
import LoginScreen from './component/login/LoginScreen.js';
import MainScreen from './component/main/MainScreen.js';

function App() {
    const [token, setToken] = useState(undefined);
    const [isLoggedIn, setLoggedIn] = useState(false);

	return (
		<div className="App">
			<AuthContext.Provider value={{token, setToken, isLoggedIn, setLoggedIn}}>
				<Container>
					{ !isLoggedIn ?
					<>
						<LoginScreen />
					</>
					:
					<>
						<MainScreen/>
					</>
					}
				</Container>
			</AuthContext.Provider>
		</div>
	);
}

export default App;
