'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { AuthState, User, UserRegistration, PasswordChangeRequest, getStorefrontConfig } from '@storefront/core';
import { getAdapterFactory, UserAdapter } from '@storefront/api';
import { TokenManager } from '../tokens/token-manager';

const STORAGE_KEY_USER = 'storefront_auth_user';

export interface AuthContextType {
  authState: AuthState;
  isLoading: boolean;
  error: string | null;
  login: (username: string, password?: string) => Promise<void>;
  register: (registration: UserRegistration) => Promise<void>;
  logout: () => void;
  updateProfile: (user: Partial<User>) => Promise<User>;
  changePassword: (request: PasswordChangeRequest) => Promise<void>;
  refreshUser: () => Promise<User | null>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export interface AuthProviderProps {
  children: React.ReactNode;
  userAdapter?: UserAdapter;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children, userAdapter: customAdapter }) => {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    isGuest: true,
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const storefrontConfig = useMemo(() => getStorefrontConfig(), []);
  const tokenManager = useMemo(() => new TokenManager(storefrontConfig.commerce.occ), [storefrontConfig]);
  const adapter = useMemo(() => customAdapter || getAdapterFactory(storefrontConfig).getUserAdapter(), [customAdapter, storefrontConfig]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Restore session from localStorage on mount
  useEffect(() => {
    const restoreSession = async () => {
      try {
        if (typeof window === 'undefined') return;

        const storedToken = tokenManager.getStoredToken();
        const storedUserRaw =
          localStorage.getItem(STORAGE_KEY_USER) || localStorage.getItem('storefront_user');

        if (storedToken && storedUserRaw) {
          const storedUser: User = JSON.parse(storedUserRaw);

          if (tokenManager.isTokenExpired(storedToken)) {
            if (storedToken.refresh_token) {
              try {
                const refreshedToken = await tokenManager.refreshUserToken(storedToken.refresh_token);
                setAuthState({
                  isAuthenticated: true,
                  isGuest: false,
                  user: storedUser,
                  token: refreshedToken,
                });
              } catch (refreshErr) {
                console.warn('[AuthProvider] Failed to refresh expired token:', refreshErr);
                tokenManager.clearStoredToken();
                localStorage.removeItem(STORAGE_KEY_USER);
                localStorage.removeItem('storefront_user');
                setAuthState({ isAuthenticated: false, isGuest: true });
              }
            } else {
              tokenManager.clearStoredToken();
              localStorage.removeItem(STORAGE_KEY_USER);
              localStorage.removeItem('storefront_user');
              setAuthState({ isAuthenticated: false, isGuest: true });
            }
          } else {
            setAuthState({
              isAuthenticated: true,
              isGuest: false,
              user: storedUser,
              token: storedToken,
            });
          }
        }
      } catch (err) {
        console.error('[AuthProvider] Failed to restore auth session:', err);
      } finally {
        setIsLoading(false);
      }
    };

    restoreSession();
  }, [tokenManager]);

  const login = useCallback(async (username: string, password?: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await adapter.login(username, password);
      tokenManager.saveStoredToken(res.token);

      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(res.user));
        localStorage.setItem('storefront_user', JSON.stringify(res.user));
        window.dispatchEvent(new CustomEvent('storefront:auth:login', { detail: { user: res.user } }));
      }

      setAuthState({
        isAuthenticated: true,
        isGuest: false,
        user: res.user,
        token: res.token,
      });
    } catch (err: any) {
      const msg = err.message || 'Login failed. Please check your credentials.';
      setError(msg);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [adapter, tokenManager]);

  const register = useCallback(async (registration: UserRegistration) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await adapter.register(registration);
      tokenManager.saveStoredToken(res.token);

      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(res.user));
        localStorage.setItem('storefront_user', JSON.stringify(res.user));
        window.dispatchEvent(new CustomEvent('storefront:auth:login', { detail: { user: res.user } }));
      }

      setAuthState({
        isAuthenticated: true,
        isGuest: false,
        user: res.user,
        token: res.token,
      });
    } catch (err: any) {
      const msg = err.message || 'Registration failed. Please try again.';
      setError(msg);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [adapter, tokenManager]);

  const logout = useCallback(() => {
    tokenManager.clearStoredToken();
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEY_USER);
      localStorage.removeItem('storefront_user');
      window.dispatchEvent(new CustomEvent('storefront:auth:logout'));
    }
    setAuthState({
      isAuthenticated: false,
      isGuest: true,
    });
    setError(null);
  }, [tokenManager]);

  const updateProfile = useCallback(async (updates: Partial<User>): Promise<User> => {
    if (!authState.user?.uid) {
      throw new Error('User is not authenticated');
    }
    setIsLoading(true);
    setError(null);
    try {
      const updatedUser = await adapter.updateUser(authState.user.uid, updates);
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(updatedUser));
      }
      setAuthState((prev) => ({
        ...prev,
        user: updatedUser,
      }));
      return updatedUser;
    } catch (err: any) {
      const msg = err.message || 'Failed to update profile';
      setError(msg);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [adapter, authState.user]);

  const changePassword = useCallback(async (request: PasswordChangeRequest): Promise<void> => {
    if (!authState.user?.uid) {
      throw new Error('User is not authenticated');
    }
    setIsLoading(true);
    setError(null);
    try {
      await adapter.changePassword(authState.user.uid, request);
    } catch (err: any) {
      const msg = err.message || 'Failed to change password';
      setError(msg);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [adapter, authState.user]);

  const refreshUser = useCallback(async (): Promise<User | null> => {
    if (!authState.user?.uid) return null;
    try {
      const freshUser = await adapter.getUser(authState.user.uid);
      if (freshUser) {
        if (typeof window !== 'undefined') {
          localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(freshUser));
        }
        setAuthState((prev) => ({
          ...prev,
          user: freshUser,
        }));
      }
      return freshUser;
    } catch (err) {
      console.warn('[AuthProvider] Failed to refresh user profile:', err);
      return null;
    }
  }, [adapter, authState.user]);

  return (
    <AuthContext.Provider
      value={{
        authState,
        isLoading,
        error,
        login,
        register,
        logout,
        updateProfile,
        changePassword,
        refreshUser,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
