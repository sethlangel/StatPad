import { createContext, useContext, useEffect, useState } from 'react';

type Session = {
    access_token: string;
    expires_at: number;
    expires_in: number;
    refresh_token: string;
    token_type: string;
    user: {
        id: string;
        aud: string;
        role: string;
        app_metadata: {
            provider: string;
            providers: string[];
        };
        confirmed_at: string;
        created_at: string;
        email: string;
        email_confirmed_at: string;
        identities: {
            // Define structure of each identity if known
            [key: string]: any;
        }[];
        is_anonymous: boolean;
        last_sign_in_at: string;
        phone: string;
        updated_at: string;
        user_metadata: {
            email: string;
            email_verified: boolean;
            phone_verified: boolean;
            [key: string]: any;
        };
    };
};

interface AuthProviderProps {
    children: React.ReactNode;
}

interface AuthContextProps {
    session?: Session;
    isLoggedIn: () => boolean;
    login: (token: string) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextProps | null>(null);

export function AuthProvider({ children }: AuthProviderProps) {
    const [session, setSession] = useState<Session | undefined>(undefined);

    useEffect(() => {
        const session = sessionStorage.getItem('session');
        console.log(session)
        if (session) setSession(JSON.parse(session));
    }, []);

    const isLoggedIn = () => {
        return session !== undefined;
    }

    const login = (session: any) => {
        sessionStorage.setItem('session', JSON.stringify(session));
        setSession(session);
    };

    const logout = () => {
        sessionStorage.removeItem('session');
        setSession(undefined);
    };

    return (
        <AuthContext.Provider value={{ session, isLoggedIn, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}