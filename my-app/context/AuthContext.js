import React, { createContext, useState, useCallback } from 'react';
import { API_URL } from '../config/APIURL'

export const AuthContext = createContext({
    isLoggedIn: false,
    registration: async (email, name, password1, password2) => ({success : false, message : 'Default fallback.'}),
    login: async (email, password) => ({success : false, message : ''}),
    logout: () => {}
  });
   
const AuthContextProvider = (props) => {
const [isLoggedIn, setIsLoggedIn] = useState(false);

const loginHandler = useCallback(async (email, password) => {
    try {
        const response = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        if (data.category == "success") {
            setIsLoggedIn(true);
            return {success : true, message: "Succeeded in logging in!"} ;
        } else {
            return {success : false, message: "Failure to log in"} ;
        }
    } catch (err) {
        return {success : false, message: "Connection failed"} ;
    }
}, []);

const registrationHandler = useCallback(async (email, name, password1, password2) => {
    console.log("Handler triggered with:", email);
    try {
        const response = await fetch(`${API_URL}/signup`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, name, password1, password2 }),
        });

        const data = await response.json();
        console.log("Server response:", data);

        if (data.category == "success") {
            setIsLoggedIn(true);
            return {success : true, message: "Succeeded in signing up!"};
        } else {
            return {success : false, message: "Failure to sign up"} ;
        }
    }
    catch (err) {
        return {success : false, message: "Connection failed"}
    }
}, []);

const logoutHandler = useCallback(() => {
    setIsLoggedIn(false);
}, []);

const initialValue = {
    isLoggedIn: isLoggedIn,
    registration: registrationHandler,
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
