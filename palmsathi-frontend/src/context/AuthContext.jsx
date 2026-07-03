import { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [farmer, setFarmer] = useState(
        JSON.parse(localStorage.getItem("farmer")) || null
    );
    const [token, setToken] = useState(
        localStorage.getItem("token") || null
    );

    function login(farmerData, jwt) {
        setFarmer(farmerData);
        setToken(jwt);
        localStorage.setItem("farmer", JSON.stringify(farmerData));
        localStorage.setItem("token", jwt);
    }

    function logout() {
        setFarmer(null);
        setToken(null);
        localStorage.removeItem("farmer");
        localStorage.removeItem("token");
    }

    return (
        <AuthContext.Provider value={{ farmer, token, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}