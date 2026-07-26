import { axiosAuth } from "./api";

export const login = async (data) => {
    return await axiosAuth.post("/Auth/login", data);
};

export const register = async (data) => {
    return await axiosAuth.post("/Auth/register", data);
};

export const forgotPassword = async (email) => {
    return await axiosAuth.post("/Auth/recover-password", { email });
};

export const resetPassword = async (data) => {
    return await axiosAuth.post("/Auth/reset-password", data);
};

export const getAllUsers = async () => {
    const { data } = await axiosAuth.get("/Auth/users");
    return data;
};

export const registerAdmin = async (data) => {
    return await axiosAuth.post("/Auth/register-admin", data);
};