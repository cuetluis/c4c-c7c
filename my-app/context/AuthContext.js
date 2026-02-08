import React, { createContext, useState, useCallback } from 'react';

export const AuthContext = createContext({
    isLoggedIn: false,
    login: async (email, password) => {},
    logout: () => {},
  });
   
const AuthContextProvider = (props) => {
const [isLoggedIn, setIsLoggedIn] = useState(false);

const loginHandler = useCallback(() => {
    setIsLoggedIn(true);
}, []);

const logoutHandler = useCallback(() => {
    setIsLoggedIn(false);
}, []);

const initialValue = {
    isLoggedIn: isLoggedIn,
    login: loginHandler,
    logout: logoutHandler,
};

return (
        <AuthContext.Provider value={initialValue}>
            {props.children}
        </AuthContext.Provider>
    );
};

export default AuthContextProvider;