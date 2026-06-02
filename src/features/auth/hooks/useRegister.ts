// hooks/useRegister.ts
import { authService } from "../services/authService";

export const useRegister = () => {
  const register = (email: string, password: string) => {
    if (!email || !password) {
      throw new Error("Missing email or password");
    }

    return authService.register(email, password);
  };

  return { register };
};