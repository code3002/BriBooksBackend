import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { authService } from '../services/api/auth.service';

interface User {
    id: string;
    email: string;
    name?: string;
    firstName?: string;
    lastName?: string;
    username?: string;
    role: string;
}

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (token: string, user: User) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const normalizeUser = (userData: User) => {
        const derivedName =
            userData.name ||
            [userData.firstName, userData.lastName].filter(Boolean).join(' ');
        return {
            ...userData,
            name: derivedName || userData.email,
        };
    };

    useEffect(() => {
        const initAuth = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                    const response = await authService.getCurrentUser();
                    const payload = response?.data ?? response;
                    const userData = payload?.data ?? payload;

                    const storedUser = localStorage.getItem('user');
                    const mergedUser = storedUser
                        ? { ...JSON.parse(storedUser), ...userData }
                        : userData;

                    if (mergedUser) {
                        setUser(normalizeUser(mergedUser));
                    }
                    setIsAuthenticated(true);
                } catch (error) {
                    console.error('Failed to fetch user', error);
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                    delete axios.defaults.headers.common['Authorization'];
                }
            }
            setIsLoading(false);
        };

        initAuth();
    }, []);

    useEffect(() => {
        const interceptorId = axios.interceptors.response.use(
            (response) => response,
            (error) => {
                if (error?.response?.status === 401) {
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                    setUser(null);
                    setIsAuthenticated(false);
                    delete axios.defaults.headers.common['Authorization'];
                }
                return Promise.reject(error);
            }
        );

        return () => {
            axios.interceptors.response.eject(interceptorId);
        };
    }, []);

    const login = (token: string, userData: User) => {
        const normalizedUser = normalizeUser(userData);
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(normalizedUser));
        setUser(normalizedUser);
        setIsAuthenticated(true);
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        setIsAuthenticated(false);
        delete axios.defaults.headers.common['Authorization'];
    };

    return (
        <AuthContext.Provider value={{ user, isAuthenticated, isLoading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
