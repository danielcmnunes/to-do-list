
import { createContext } from 'react';

export const AuthContext = createContext({    
    isLoggedIn: false,
    token: undefined,
    setLoggedIn: () => {},
    setToken: () => {}
});