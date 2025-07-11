import { IUserService } from "./IUserService";
import { IUserRepository } from "../domain/repositories/IUserRepository";
import { User } from "../domain/entities/User";
import { ForbiddenError, NotFoundError } from "../errors/ApiError";


export class UserServiceImpl implements IUserService {
  constructor(private readonly userRepo: IUserRepository) {
  }

  async updateUserProfile(userIdFromToken: string, email: string, data: Partial<User>): Promise<User> {
    const user = await this.userRepo.findByEmail(email);
    if (!user) {
      throw new NotFoundError("User with given email doesn't exist");
    }

    if (userIdFromToken !== user.id) {
      throw new ForbiddenError("Not allowed to update user");
    }

    return this.userRepo.update(email, data);
  }

  async deleteAccount(email: string): Promise<User> {
    return this.userRepo.delete(email);
  }
}