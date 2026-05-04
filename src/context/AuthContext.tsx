import { createContext, useContext, useState, ReactNode } from 'react';

type AuthContextType = {
  isLoggedIn: boolean;
  loginWithGoogle: () => void;
  loginWithEmail: (email: string, pass: string) => void;
  signupWithEmail: (name: string, email: string, pass: string) => void;
  logout: () => void;
  user: any;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<any>(null);

  const loginWithGoogle = () => {
    // Simulating Google login for now
    setIsLoggedIn(true);
    setUser({ name: 'User LawGo', email: 'user@lawgo.id' });
  };

  const loginWithEmail = (email: string, pass: string) => {
    setIsLoggedIn(true);
    setUser({ name: email.split('@')[0], email });
  };

  const signupWithEmail = (name: string, email: string, pass: string) => {
    setIsLoggedIn(true);
    setUser({ name, email });
  };

  const logout = () => {
    setIsLoggedIn(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, loginWithGoogle, loginWithEmail, signupWithEmail, logout, user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
