import { createContext } from "react-router";

export type AuthState = {
  isSignedIn: boolean;
  csrfToken: string;
};

export const authContext = createContext<AuthState | null>();
