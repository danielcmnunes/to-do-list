
import { createContext } from 'react';

export const TodoListDisplayContext = createContext({
    hideCompleted: undefined,
    sortingOrder: undefined,
    failMessage: undefined,
    setHideCompleted: () => {},
    setSortingOrder: () => {},
    setFailMessage: () => {}
});