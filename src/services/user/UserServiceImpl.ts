import { User } from "../../domain/entities/User";
import { IUserService } from "./IUserService";
import { ForbiddenError, NotFoundError } from "../../errors/ApiError";
import { IUserRepository, UpdateUserProfileDTO } from "../../domain/repositories/IUserRepository";


export class UserServiceImpl implements IUserService {
  constructor(private readonly userRepo: IUserRepository) {
  }

  async updateUserProfile(userIdFromToken: string, email: string, data: UpdateUserProfileDTO): Promise<User> {
    const ALLOWED_FIELDS: (keyof UpdateUserProfileDTO)[] = ["name"];
    const invalidFields = Object.keys(data).filter((key) => !ALLOWED_FIELDS.includes(key as keyof UpdateUserProfileDTO));

    if (invalidFields.length > 0) {
      throw new ForbiddenError(`Not allowed to update: ${invalidFields.join((", "))}`);
    }

    const user = await this.userRepo.findByEmail(email);
    if (!user) {
      throw new NotFoundError("User with given email doesn't exist");
    }

    if (userIdFromToken !== user.id) {
      throw new ForbiddenError("Not allowed to update user");
    }

    const updatedUser = new User({
      ...user,
      ...data
    });
    return this.userRepo.update(email, updatedUser);
  }

  async deleteAccount(email: string): Promise<User> {
    return this.userRepo.delete(email);
  }
}