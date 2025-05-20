import { createContext, useContext, useEffect, useState } from 'react';

interface AuthProviderProps {
    children: React.ReactNode;
}

interface AuthContextProps {
    accessToken: string;
    isLoggedIn: () => boolean;
    login: (token: string) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextProps | null>(null);

export function AuthProvider({ children }: AuthProviderProps) {
    const [accessToken, setAccessToken] = useState("");

    useEffect(() => {
        const token = sessionStorage.getItem('access_token');
        if (token) setAccessToken(token);
    }, []);

    const isLoggedIn = () => {
        return accessToken !== "";
    }

    const login = (token: string) => {
        sessionStorage.setItem('access_token', token);
        setAccessToken(token);
    };

    const logout = () => {
        sessionStorage.removeItem('access_token');
        setAccessToken("");
    };

    return (
        <AuthContext.Provider value={{ accessToken, isLoggedIn, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}