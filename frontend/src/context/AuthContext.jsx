import { useState, useEffect } from "react";
import { signup, login } from "../api/auth";
import { AuthContext } from './auth-context';

export const AuthProvider = ({children}) => {
    const [authState, setAuthState] = useState({
        user: null,
        token: null,
        isAuth: false,
        isLoading: true,
        isError: null
    });

    useEffect(() => {
        // check if user is already authenticated 
        const token = localStorage.getItem("token");
        if (token) {
            setAuthState({
                user: JSON.parse(localStorage.getItem("user") || null),
                token,
                isAuth: true,
                isLoading: false,
                isError: null
            })
        } else {
            setAuthState(prev => ({
                ...prev,
                isLoading: false,
                isError: null
            }))
        }
    }, []);


    const handleLogin = async (data) => {
        try {
          setAuthState(prevState => ({ ...prevState, isLoading: true, isError: null }));
          const response = await login(data);
          
          // In a real app, you might want to decode the JWT to get user info
          // For now, we'll just create a simple user object
          const user = { id: 'user-id', username: data.username };
          
          // The token is directly in the response for signin
          localStorage.setItem('token', response);
          localStorage.setItem('user', JSON.stringify(user));
          
          setAuthState({
            user,
            token: response,
            isAuth: true,
            isLoading: false,
            isError: null,
          });
        } catch (error) {
          setAuthState(prevState => ({
            ...prevState,
            isLoading: false,
            isError: error instanceof Error ? error.message : 'Failed to login',
          }));
          throw error;
        }
      };
    
    const handleSignup = async (data) => {
        try {
          setAuthState(prevState => ({ ...prevState, isLoading: true, isError: null }));
          const response = await signup(data);
          
          // In a real app, you might want to decode the JWT to get user info
          // For now, we'll just create a simple user object
          const user = { id: 'user-id', username: data.username };
          
          localStorage.setItem('token', response.token);
          localStorage.setItem('user', JSON.stringify(user));
          
          setAuthState({
            user,
            token: response.token,
            isAuth: true,
            isLoading: false,
            isError: null,
          });
        } catch (error) {
          setAuthState(prevState => ({
            ...prevState,
            isLoading: false,
            isError: error instanceof Error ? error.message : 'Failed to signup',
          }));
          throw error;
        }
      };
    
    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setAuthState({
          user: null,
          token: null,
          isAuth: false,
          isLoading: false,
          isError: null,
        });
      };

      return (
        <AuthContext.Provider value={{ authState, handleLogin, handleSignup, handleLogout }}>
          {children}
        </AuthContext.Provider>
      );
    
    }
