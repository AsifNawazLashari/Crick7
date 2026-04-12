import { useState, useCallback } from 'react';
import { db } from '../data/db';
import { User, UserRole } from '../types';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(db.auth.getCurrentUser());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = useCallback(async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      await new Promise(r => setTimeout(r, 600));
      const result = db.auth.login(email, password);
      if (result) {
        setUser(result);
        return result;
      } else {
        setError('Invalid email or password');
        return null;
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const register = useCallback(async (name: string, email: string, password: string, role: UserRole) => {
    setLoading(true);
    setError(null);
    try {
      await new Promise(r => setTimeout(r, 600));
      const existing = db.users.getAll().find(u => u.email === email);
      if (existing) { setError('Email already registered'); return null; }
      const newUser = db.auth.register({ name, email, role });
      db.auth.login(email, password);
      setUser(newUser);
      return newUser;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    db.auth.logout();
    setUser(null);
  }, []);

  return { user, loading, error, login, register, logout, setError };
};
