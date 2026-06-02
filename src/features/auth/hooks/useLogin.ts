import { authService } from "../services/authService";

export const useLogin = () => {
  const login = (email: string, password: string) => {
    return authService.login(email, password);
  };

  return { login };
};