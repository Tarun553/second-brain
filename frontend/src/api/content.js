import { API_URL } from "./config";
import { getHeaders } from "./config";

export const getContents = async (token) => {
    try {
        const response = await fetch(`${API_URL}/content`, {
            method: "GET",
            headers: getHeaders(token),
        })
        const data = await response.json()
        return data
    } catch (error) {
        console.log(error)
    }   
}

export const createContent = async (contentData, token) => {
    try {
        const response = await fetch(`${API_URL}/content`, {
            method: "POST",
            headers: getHeaders(token),
            body: JSON.stringify(contentData),
        })
        const data = await response.json()
        return data
    } catch (error) {
        console.log(error)
    }   
}

export const deleteContent = async (contentId, token) => {
    try {
        const response = await fetch(`${API_URL}/content`, {
            method: "DELETE",
            headers: getHeaders(token),
        })
        const data = await response.json()
        return data
    } catch (error) {
        console.log(error)
    }   
}


export const shareContent = async (contentId, token, shareData) => {
    try {
        const response = await fetch(`${API_URL}/brain/share`, {
            method: "POST",
            headers: getHeaders(token),
            body: JSON.stringify(shareData),
        })
        const data = await response.json()
        return data
    } catch (error) {
        console.log(error)
    }   
}

export const getSharedContent = async (token, shareLink) => {
    try {
        const response = await fetch(`${API_URL}/brain/${shareLink}`, {
            method: "GET",
            headers: getHeaders(token),
        })
        const data = await response.json()
        return data
    } catch (error) {
        console.log(error)
    }   
}

