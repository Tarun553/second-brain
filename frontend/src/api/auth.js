import { API_URL } from "./config";
import { getHeaders } from "./config";

export const signup = async (userData) => {
    const response = await fetch(`${API_URL}/signup`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify(userData),
    });
    
    const data = await response.json();
    
    if (!response.ok) {
        throw new Error(data.message || 'Failed to sign up');
    }
    
    if (!data.token) {
        throw new Error('No token received from server');
    }
    return data;
}

export const login = async (userData) => {
    const response = await fetch(`${API_URL}/signin`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify(userData),
    });
    
    const data = await response.json();
    
    if (!response.ok) {
        throw new Error(data.message || 'Failed to login');
    }
    
    if (!data.token) {
        throw new Error('No token received from server');
    }
    return data.token;
}