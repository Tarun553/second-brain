import { API_URL, getHeaders } from "./config";

export const getContents = async (token) => {
    try {
        console.log("Fetching contents from:", `${API_URL}/content`);
        console.log("Using token:", token ? "Token exists" : "No token");
        
        const response = await fetch(`${API_URL}/content`, {
            method: "GET",
            headers: getHeaders(token),
        });

        console.log("Content response status:", response.status);
        
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            console.error("Server error response:", errorData);
            throw new Error(errorData.message || `Server error: ${response.status}`);
        }

        const data = await response.json();
        console.log("Content data received:", data ? `${data.length} items` : "No data");
        return data || [];
    } catch (error) {
        console.error("Error fetching content:", error);
        throw error;
    }   
}

export const createContent = async (contentData, token) => {
    try {
        console.log("Creating content:", contentData);
        console.log("Using token:", token ? "Token exists" : "No token");
        
        const response = await fetch(`${API_URL}/content`, {
            method: "POST",
            headers: getHeaders(token),
            body: JSON.stringify(contentData),
        });

        console.log("Create content response status:", response.status);
        
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            console.error("Server error response:", errorData);
            throw new Error(errorData.message || `Server error: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error creating content:", error);
        throw error;
    }   
}

export const deleteContent = async (contentId, token) => {
    try {
        console.log("Deleting content with ID:", contentId);
        console.log("Using token:", token ? "Token exists" : "No token");
        
        // Using URL parameter instead of body
        const response = await fetch(`${API_URL}/content/${contentId}`, {
            method: "DELETE",
            headers: getHeaders(token),
        });

        console.log("Delete content response status:", response.status);
        
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            console.error("Server error response:", errorData);
            throw new Error(errorData.message || `Server error: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error deleting content:", error);
        throw error;
    }   
}

export const shareContent = async (token, shareData) => {
    try {
        console.log("Sharing content:", shareData);
        console.log("Using token:", token ? "Token exists" : "No token");
        
        const response = await fetch(`${API_URL}/brain/share`, {
            method: "POST",
            headers: getHeaders(token),
            body: JSON.stringify(shareData),
        });

        console.log("Share content response status:", response.status);
        
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            console.error("Server error response:", errorData);
            throw new Error(errorData.message || `Server error: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error sharing content:", error);
        throw error;
    }   
}

export const getSharedContent = async (shareLink, token = null) => {
    try {
        console.log("Getting shared content with link:", shareLink);
        console.log("Using token:", token ? "Token exists" : "No token");
        
        const response = await fetch(`${API_URL}/brain/${shareLink}`, {
            method: "GET",
            headers: getHeaders(token),
        });

        console.log("Get shared content response status:", response.status);
        
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            console.error("Server error response:", errorData);
            throw new Error(errorData.message || `Server error: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error getting shared content:", error);
        throw error;
    }   
}