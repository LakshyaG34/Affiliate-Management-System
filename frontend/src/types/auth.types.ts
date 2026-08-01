export interface User {
  id: string;
  name: string;
  email: string;
  role: "USER" | "ADMIN";
  referralCode: string;
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;

  login: (user: User) => void;
  logout: () => void;
}