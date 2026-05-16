import { useState } from "react";
import type { ReactNode } from "react";
import type { User } from "../types";
import { AuthContext } from "./AuthContextValue";

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
}

const getInitialAuthState = (): AuthState => {
  const storedToken = localStorage.getItem("token");
  const storedUser = localStorage.getItem("user");

  if (storedToken && storedUser) {
    try {
      return {
        token: storedToken,
        user: JSON.parse(storedUser) as User,
        isLoading: false,
      };
    } catch {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }
  }

  return {
    user: null,
    token: null,
    isLoading: false,
  };
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [auth, setAuth] = useState<AuthState>(getInitialAuthState);

  const login = (token: string, user: User) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
    setAuth({ token, user, isLoading: false });
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setAuth({ token: null, user: null, isLoading: false });
  };

  return (
    <AuthContext.Provider value={{ ...auth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
