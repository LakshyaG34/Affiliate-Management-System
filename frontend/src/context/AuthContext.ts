import { createContext } from "react";
import type { AuthContextType } from "@/types/auth.types";

const AuthContext = createContext<AuthContextType | null>(null);

export default AuthContext;