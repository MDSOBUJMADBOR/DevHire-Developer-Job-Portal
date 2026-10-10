import {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from "react";

import { api } from "../services/api";

import type {
  User,
  AuthResponse,
} from "../types/auth";

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;

  login: (
    email: string,
    password: string
  ) => Promise<void>;

  register: (
    name: string,
    email: string,
    password: string,
    role?: string
  ) => Promise<void>;

  logout: () => void;
}

const AuthContext =
  createContext<AuthContextType | undefined>(
    undefined
  );

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({
  children,
}: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const savedToken = localStorage.getItem("token");
      const savedUser = localStorage.getItem("user");
      if (savedToken && savedUser) {
        return JSON.parse(savedUser) as User;
      }
    } catch {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }
    return null;
  });

  const [token, setToken] = useState<string | null>(() =>
    localStorage.getItem("token")
  );

  const [loading] = useState(false);

  const login = async (
    email: string,
    password: string
  ) => {
    const response =
      await api<AuthResponse>(
        "/auth/login",
        {
          method: "POST",
          body: JSON.stringify({
            email,
            password,
          }),
        }
      );

    const loggedInUser =
      response.data.user;

    const authToken =
      response.data.token;

    localStorage.setItem(
      "token",
      authToken
    );

    localStorage.setItem(
      "user",
      JSON.stringify(loggedInUser)
    );

    setToken(authToken);
    setUser(loggedInUser);
  };

  const register = async (
    name: string,
    email: string,
    password: string,
    role = "CANDIDATE"
  ) => {
    const response =
      await api<AuthResponse>(
        "/auth/register",
        {
          method: "POST",
          body: JSON.stringify({
            name,
            email,
            password,
            role,
          }),
        }
      );

    const registeredUser =
      response.data.user;

    const authToken =
      response.data.token;

    localStorage.setItem(
      "token",
      authToken
    );

    localStorage.setItem(
      "user",
      JSON.stringify(registeredUser)
    );

    setToken(authToken);
    setUser(registeredUser);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user && !!token,
        loading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside AuthProvider"
    );
  }

  return context;
};