
import { createContext } from 'react';

export const TodoListDisplayContext = createContext({
    hideCompleted: undefined,
    sortingOrder: undefined,
    setHideCompleted: () => {},
    setSortingOrder: () => {}
});