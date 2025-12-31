import { createContext } from "react-router";

export type AuthContext = {
  isSignedIn: boolean;
  csrfToken: string;
};

export const authContext = createContext<AuthContext | null>();
