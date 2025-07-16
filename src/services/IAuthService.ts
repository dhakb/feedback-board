import { Role, User } from "../domain/entities/User";


export interface LoginResult {
  user: Omit<User, "password">;
  token: string;
}

export interface IAuthService {
  register(name: string, email: string, password: string): Promise<Omit<User, "password">>;

  login(email: string, password: string): Promise<LoginResult>;

  verifyToken(token: string): { userId: string, role: Role };
}