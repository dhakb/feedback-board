import { User } from "../domain/entities/User";


export interface IUserService {
  updateUserProfile(userIdFromToken: string, email: string, data: Partial<User>): Promise<User>;

  deleteAccount(email: string): Promise<User>;
}