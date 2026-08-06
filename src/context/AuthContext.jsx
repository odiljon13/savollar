import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  getCurrentUser,
  saveCurrentUser,
  removeCurrentUser,
  findUserByUsername,
  encodePassword,
  addRegisteredUser
} from '../utils/auth';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = getCurrentUser();
    if (storedUser) {
      setUser(storedUser);
    }
    setLoading(false);
  }, []);

  const login = (username, password) => {
    const existingUser = findUserByUsername(username);
    if (!existingUser) {
      return { success: false, error: "Noto'g'ri username yoki parol" };
    }

    if (existingUser.password !== encodePassword(password)) {
      return { success: false, error: "Noto'g'ri username yoki parol" };
    }

    const { password: _, ...userWithoutPassword } = existingUser;
    
    saveCurrentUser(userWithoutPassword);
    setUser(userWithoutPassword);
    
    return { success: true };
  };

  const register = (username, password, firstName, lastName) => {
    const existingUser = findUserByUsername(username);
    if (existingUser) {
      return { success: false, error: 'Bu username allaqachon band' };
    }

    const newUser = {
      username,
      password: encodePassword(password),
      firstName,
      lastName,
      isAdmin: false,
      createdAt: new Date().toISOString()
    };

    addRegisteredUser(newUser);
    return { success: true };
  };

  const logout = () => {
    removeCurrentUser();
    setUser(null);
  };

  if (loading) {
    return null;
  }

  const value = {
    user,
    isAuthenticated: !!user,
    isAdmin: !!user?.isAdmin,
    login,
    register,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
