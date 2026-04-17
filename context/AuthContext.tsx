import React, { createContext, useContext, useEffect, useState } from "react";
import { User as FirebaseUser } from "firebase/auth";
import { User } from "@/types";
import * as authService from "@/services/authService";

interface AuthContextType {
  user: User | null;
  firebaseUser: FirebaseUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (
    email: string,
    password: string,
    name: string,
    phone: string,
    language: "ar" | "tr" | "en"
  ) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateProfile: (
    data: Partial<Pick<User, "name" | "phone" | "language" | "addresses">>
  ) => Promise<void>;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const unsubscribe = authService.onAuthChange(async (fbUser) => {
      setFirebaseUser(fbUser);
      if (fbUser) {
        try {
          const profile = await authService.getUserProfile(fbUser.uid);
          setUser(profile);
          setIsAdmin(profile?.role === "admin");
        } catch {
          setUser(null);
          setIsAdmin(false);
        }
      } else {
        setUser(null);
        setIsAdmin(false);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const login = async (email: string, password: string) => {
    const u = await authService.loginWithEmail(email, password);
    setUser(u);
    setIsAdmin(u.role === "admin");
  };

  const register = async (
    email: string,
    password: string,
    name: string,
    phone: string,
    language: "ar" | "tr" | "en"
  ) => {
    const u = await authService.register(email, password, name, phone, language);
    setUser(u);
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
    setIsAdmin(false);
  };

  const resetPassword = async (email: string) => {
    await authService.resetPassword(email);
  };

  const updateProfile = async (
    data: Partial<Pick<User, "name" | "phone" | "language" | "addresses">>
  ) => {
    if (!firebaseUser) return;
    await authService.updateUserProfile(firebaseUser.uid, data);
    const updated = await authService.getUserProfile(firebaseUser.uid);
    setUser(updated);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        firebaseUser,
        loading,
        login,
        register,
        logout,
        resetPassword,
        updateProfile,
        isAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
