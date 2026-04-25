import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { api } from "../api";

interface User {
  id: string;
  name: string;
  email: string;
  role: "owner" | "renter";
  phoneNumber: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (
    name: string,
    email: string,
    password: string,
    role: "owner" | "renter",
    phoneNumber: string
  ) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  isAuthenticated: boolean;
  authLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("rentit_user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const signup = async (
    name: string,
    email: string,
    password: string,
    role: "owner" | "renter",
    phoneNumber: string
  ) => {
    setAuthLoading(true);
    try {
      const data = await api("/api/auth/signup", {
        method: "POST",
        body: JSON.stringify({ name, email, password, role, phoneNumber }),
      });

      const userData = {
          id: data._id,
          name: data.name,
          email: data.email,
          role: data.role,
          phoneNumber: data.phoneNumber,
        };
        setUser(userData);
        localStorage.setItem("rentit_user", JSON.stringify(userData));
        localStorage.setItem("token", data.token);
        console.log("Token stored in localStorage (signup):", data.token);
        return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message || "Signup failed" };
    } finally {
      setAuthLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    setAuthLoading(true);
    try {
      const data = await api("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });

      const userData = {
          id: data._id,
          name: data.name,
          email: data.email,
          role: data.role,
          phoneNumber: data.phoneNumber,
        };
        // Token must be stored before state update for instant persistence
        localStorage.setItem("token", data.token);
        localStorage.setItem("rentit_user", JSON.stringify(userData));
        setUser(userData);
        console.log("Token stored instantly (login):", data.token);
        return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message || "Login failed" };
    } finally {
      setAuthLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("rentit_user");
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        signup,
        logout,
        isAuthenticated: !!user,
        authLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
