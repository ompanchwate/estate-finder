import {createContext} from 'react'

const UserDetailContext = createContext();

export default UserDetailContext


/* In React, the createContext function is used to create a context object. A context object allows you to 
share data between components without the need to pass props manually through every level of the component tree. 
It provides a way to pass data down the component tree without having to explicitly pass the props from parent to child components. */