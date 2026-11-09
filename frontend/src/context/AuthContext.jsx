
import { createContext, useContext, useState, useEffect } from "react";
import { apiRequest } from "../services/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
const [loading, setLoading] = useState(true);

useEffect(() => {
    const checkUser = async () => {
        try {
            const data = await apiRequest("/auth/me");
            setUser(data.user);
        } catch (error) {
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    checkUser();
}, []);


    const register = async (email, password) => {
        return await apiRequest("/auth/register", {
            method: "POST",
            body: JSON.stringify({ email, password })
        });
    };


    const login = async (email, password) => {
        const data = await apiRequest("/auth/login", {
            method: "POST",
            body: JSON.stringify({ email, password })
        });

        setUser(data.user);
        return data;
    };


    const logout = async () => {
        try {
            await apiRequest("/auth/logout", {
                method: "POST"
            });
        } finally {
            setUser(null);
        }
    };

    const value = {
        user,
        setUser,
        loading,
        setLoading,
        register,
        login,
        logout
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};


export const useAuth = () => {
    return useContext(AuthContext);
};
