
import { createContext } from 'react';

export const TodoListContext = createContext({
    items: [],
    setContextList: () => {}
});