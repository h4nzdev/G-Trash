import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in on mount
    const storedUser = localStorage.getItem('gtrash_official_user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Failed to parse stored user:', error);
        localStorage.removeItem('gtrash_official_user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email, password) => {
    // Mock authentication - replace with real API call
    const mockUsers = [
      {
        id: '1',
        email: 'admin@gtrash.com',
        password: 'admin123',
        fullName: 'Admin User',
        role: 'admin',
        barangay: 'All Barangays',
      },
      {
        id: '2',
        email: 'official@lahug.com',
        password: 'official123',
        fullName: 'Barangay Captain - Lahug',
        role: 'official',
        barangay: 'Lahug',
      },
      {
        id: '3',
        email: 'official@apas.com',
        password: 'official123',
        fullName: 'Barangay Captain - Apas',
        role: 'official',
        barangay: 'Apas',
      },
    ];

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));

    const foundUser = mockUsers.find(
      u => u.email === email && u.password === password
    );

    if (!foundUser) {
      throw new Error('Invalid email or password');
    }

    const { password: _, ...userWithoutPassword } = foundUser;
    setUser(userWithoutPassword);
    localStorage.setItem('gtrash_official_user', JSON.stringify(userWithoutPassword));
    return userWithoutPassword;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('gtrash_official_user');
    sessionStorage.clear();
  };

  const updateProfile = async (updates) => {
    const updatedUser = { ...user, ...updates };
    setUser(updatedUser);
    localStorage.setItem('gtrash_official_user', JSON.stringify(updatedUser));
    return updatedUser;
  };

  const value = {
    user,
    isLoading,
    login,
    logout,
    updateProfile,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
