import { User } from "../../domain/entities/User";
import { UpdateUserProfileDTO } from "../../domain/repositories/IUserRepository";


export interface IUserService {
  updateUserProfile(userIdFromToken: string, data: UpdateUserProfileDTO): Promise<User>;

  deleteAccount(email: string): Promise<User>;
}