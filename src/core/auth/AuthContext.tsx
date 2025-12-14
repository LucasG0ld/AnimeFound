import React, { createContext, useState, useEffect, useContext } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '../services/supabase';
import * as Linking from 'expo-linking';
import * as WebBrowser from 'expo-web-browser';

type AuthContextType = {
    session: Session | null;
    user: User | null;
    loading: boolean;
    signInWithEmail: (email: string, password: string) => Promise<{ error: any }>;
    signInWithGoogle: () => Promise<{ error: any }>;
    signUp: (email: string, password: string, username: string) => Promise<{ error: any }>;
    signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
    session: null,
    user: null,
    loading: true,
    signInWithEmail: async () => ({ error: null }),
    signInWithGoogle: async () => ({ error: null }),
    signUp: async () => ({ error: null }),
    signOut: async () => { },
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [session, setSession] = useState<Session | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // 1. Check initial session
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            setUser(session?.user ?? null);
            setLoading(false);
        });

        // 2. Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
            setUser(session?.user ?? null);
            setLoading(false);
        });

        return () => {
            subscription.unsubscribe();
        };
    }, []);

    const signInWithEmail = async (email: string, password: string) => {
        try {
            const { error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });
            if (error) throw error;
            return { error: null };
        } catch (error: any) {
            console.error('Sign In Error:', error);
            return { error };
        }
    };

    const signInWithGoogle = async () => {
        try {
            // Hardcoded redirect to ensure consistency with scheme
            const redirectUrl = Linking.createURL('/auth/callback');

            // Ensure browser session cleanup
            WebBrowser.maybeCompleteAuthSession();

            const { data, error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: redirectUrl,
                    skipBrowserRedirect: true,
                },
            });

            if (error) throw error;
            if (!data.url) throw new Error("No URL returned from Supabase");

            // 2. Open WebBrowser
            const result = await WebBrowser.openAuthSessionAsync(
                data.url,
                redirectUrl,
                {
                    showInRecents: true,
                }
            );

            // 3. Handle Result
            if (result.type === 'success') {
                const { url } = result;
                if (url) {
                    supabase.auth.startAutoRefresh(); // ensure session flows

                    // The following logic was part of the original implementation to manually set session
                    // after a successful deep link. With startAutoRefresh, Supabase should handle this.
                    // However, if auto-refresh doesn't immediately pick up the session,
                    // this manual parsing might still be needed as a fallback or for immediate session update.
                    // Keeping it for robustness based on the original intent.
                    if (url.includes('access_token') || url.includes('code')) {
                        const params = new URLSearchParams(url.split('#')[1] || url.split('?')[1]);
                        const access_token = params.get('access_token');
                        const refresh_token = params.get('refresh_token');

                        if (access_token && refresh_token) {
                            const { error: setSessionError } = await supabase.auth.setSession({
                                access_token,
                                refresh_token,
                            });
                            if (setSessionError) throw setSessionError;
                            return { error: null };
                        }
                    }
                }
            }
            return { error: null };
        } catch (error) {
            console.error('Google Sign-In Error:', error);
            return { error: error };
        }
    };

    const signUp = async (email: string, password: string, username: string) => {
        try {
            const { error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        username,
                    },
                },
            });
            if (error) {
                console.error('Supabase SignUp Error (Details):', JSON.stringify(error, null, 2));
                throw error;
            }
            return { error: null };
        } catch (error: any) {
            console.error('Sign Up Catch Error:', error);
            return { error };
        }
    };

    const signOut = async () => {
        try {
            await supabase.auth.signOut();
            setSession(null);
            setUser(null);
            // Optionally clear specific keys if needed, but supabase.auth.signOut() handles the adapter.
            // If using pure Expo SecureStore adapter, it should delete the key.
        } catch (error) {
            console.error('Sign Out Error:', error);
        }
    };

    return (
        <AuthContext.Provider
            value={{
                session,
                user,
                loading,
                signInWithEmail,
                signInWithGoogle,
                signUp,
                signOut,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
