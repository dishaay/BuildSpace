import api from "./api";

export const register = (data) =>
    api.post("/auth/register", data);

export const login = (data) =>
    api.post("/api/auth/login", data);

export const forgotPassword = (email) =>
    api.post(
        "/auth/forgot-password",
        { email }
    );

export const resetPassword = (
    email,
    otp,
    newPassword
) =>
    api.post(
        "/auth/reset-password",
        {
            email,
            otp,
            newPassword,
        }
    );