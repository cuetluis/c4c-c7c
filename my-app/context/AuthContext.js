import React, { createContext, useState, useCallback } from 'react';

export const AuthContext = createContext({
    isLoggedIn: false,
    login: async (email, password) => ({success : false, message : ''}),
    logout: () => {}
  });
   
const AuthContextProvider = (props) => {
const [isLoggedIn, setIsLoggedIn] = useState(false);

const loginHandler = useCallback(async (email, password) => {
    try {
        const response = await fetch('http://127.0.0.1:8000/login', {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        if (response.category == "success") {
            setIsLoggedIn(true);
            return {success : true, message: "Woop!"} ;
        } else {
            return {success : false, message: "Failure to log in"} ;
        }
    } catch (err) {
        return {success : false, message: "Connection failed"} ;
    }
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