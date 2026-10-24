"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { User, UserRole } from "@/lib/types";
import { DEMO_USERS } from "@/lib/data/mockData";
import { InkloomStore } from "@/lib/data/store";

interface AuthContextType {
  currentUser: User;
  currentRole: UserRole;
  switchUser: (role: UserRole) => void;
  setUser: (user: User) => void;
  allUsers: User[];
  isAuthorized: (allowedRoles: UserRole[]) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUserState] = useState<User>(DEMO_USERS[1]); // default Brand Manager Alex Rivera
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const active = InkloomStore.getActiveUser();
    if (active) {
      setCurrentUserState(active);
    }
  }, []);

  const switchUser = (role: UserRole) => {
    const found = DEMO_USERS.find((u) => u.role === role) || DEMO_USERS[0];
    setCurrentUserState(found);
    InkloomStore.setActiveUser(found);
  };

  const setUser = (user: User) => {
    setCurrentUserState(user);
    InkloomStore.setActiveUser(user);
  };

  const isAuthorized = (allowedRoles: UserRole[]) => {
    return allowedRoles.includes(currentUser.role);
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        currentRole: currentUser.role,
        switchUser,
        setUser,
        allUsers: DEMO_USERS,
        isAuthorized,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
