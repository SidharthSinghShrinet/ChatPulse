import { apiInstance } from "./axiosInstance";


export const registerUserApi = (userData) => {
    return apiInstance.post("/users/register", userData);
}

export const loginUserApi = (userData) => {
    return apiInstance.post("/users/login", userData);
}

export const logoutUserApi = () => {
    return apiInstance.get("/users/logout");
}

export const getLoggedInUserProfile = () => {
    return apiInstance.get("/users/me");
}

export const getAllUsersApi = () => {
    return apiInstance.get("/users/all");
}

export const getAllUsersWithMetadataApi = (page = 1, limit = 20) => {
    return apiInstance.get(`/users/all/metadata?page=${page}&limit=${limit}`)
}

export const getMessagesApi = (userId) => {
    return apiInstance.get(`/messages/${userId}`);
}

export const sendMessageApi = (message, userId) => {
    return apiInstance.post(`/messages/send/${userId}`, { message });
}