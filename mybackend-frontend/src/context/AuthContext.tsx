import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth as useClerkAuth, useClerk, useUser } from '@clerk/react';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { getToken } = useClerkAuth();
    const [ready, setReady] = useState(false);

    useEffect(() => {
        const interceptor = axios.interceptors.request.use(async (config) => {
            if (config.url?.startsWith('/api/')) {
                const token = await getToken();
                if (token) {
                    config.headers.Authorization = `Bearer ${token}`;
                } else {
                    delete config.headers.Authorization;
                }
            }
            return config;
        });
        const frame = requestAnimationFrame(() => setReady(true));
        return () => {
            cancelAnimationFrame(frame);
            axios.interceptors.request.eject(interceptor);
        };
    }, [getToken]);

    return ready ? <>{children}</> : null;
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
    const { isLoaded, isSignedIn } = useClerkAuth();
    const { user } = useUser();
    const clerk = useClerk();
    return {
        user: user ? {
            id: user.id,
            email: user.primaryEmailAddress?.emailAddress || '',
            name: user.fullName || user.primaryEmailAddress?.emailAddress || '',
        } : null,
        isAuthenticated: Boolean(isSignedIn),
        isLoading: !isLoaded,
        logout: () => clerk.signOut(),
    };
};
