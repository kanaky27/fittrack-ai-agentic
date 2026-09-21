import React, { createContext, useState, useEffect } from 'react';
import type { User, AppContextType, Credentials, FoodEntry, ActivityEntry } from '../types';
import { initialState } from '../types';
import api from '../api';

export const AppContext = createContext<AppContextType>(initialState);

export function AppProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User>(null);
    const [isUserFetched, setIsUserFetched] = useState(false);
    const [onboardingCompleted, setOnboardingCompleted] = useState(false);
    const [allFoodLogs, setAllFoodLogs] = useState<FoodEntry[]>([]);
    const [allActivityLogs, setAllActivityLogs] = useState<ActivityEntry[]>([]);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            fetchUser(token);
        } else {
            setIsUserFetched(true);
        }
    }, []);

    const fetchUser = async (token: string) => {
        try {
            const res = await api.get('/users/me', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUser({ ...res.data, token });
            
            // Check onboarding
            if (res.data.goal && res.data.weight) {
                setOnboardingCompleted(true);
            }
            
            // Fetch logs
            const [foodRes, activityRes] = await Promise.all([
                api.get('/meals?sort=createdAt:desc', { headers: { Authorization: `Bearer ${token}` } }),
                api.get('/activities?sort=createdAt:desc', { headers: { Authorization: `Bearer ${token}` } }).catch(() => ({data: {data: []}}))
            ]);
            
            if (foodRes.data?.data) {
                setAllFoodLogs(foodRes.data.data);
            }
            if (activityRes.data?.data) {
                setAllActivityLogs(activityRes.data.data);
            }
        } catch (error) {
            console.error('Error fetching user:', error);
            localStorage.removeItem('token');
        } finally {
            setIsUserFetched(true);
        }
    };

    const login = async (credentials: Credentials) => {
        const { email, password } = credentials;
        const res = await api.post('/auth/local', { identifier: email, password });
        localStorage.setItem('token', res.data.jwt);
        await fetchUser(res.data.jwt);
    };

    const signup = async (credentials: Credentials) => {
        const { username, email, password } = credentials;
        const res = await api.post('/auth/local/register', { username, email, password });
        localStorage.setItem('token', res.data.jwt);
        await fetchUser(res.data.jwt);
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
        setOnboardingCompleted(false);
        setAllFoodLogs([]);
        setAllActivityLogs([]);
    };

    return (
        <AppContext.Provider value={{
            user, setUser, login, signup, fetchUser, isUserFetched, logout,
            onboardingCompleted, setOnboardingCompleted,
            allFoodLogs, setAllFoodLogs,
            allActivityLogs, setAllActivityLogs
        }}>
            {children}
        </AppContext.Provider>
    );
}
