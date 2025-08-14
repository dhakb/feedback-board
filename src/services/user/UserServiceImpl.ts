import { User } from "../../domain/entities/User";
import { IUserService } from "./IUserService";
import { ForbiddenError, NotFoundError } from "../../errors/ApiError";
import { IUserRepository, UpdateUserProfileDTO } from "../../domain/repositories/IUserRepository";


export class UserServiceImpl implements IUserService {
  constructor(private readonly userRepo: IUserRepository) {
  }

  async updateUserProfile(userIdFromToken: string, data: UpdateUserProfileDTO): Promise<User> {
    const ALLOWED_FIELDS: (keyof UpdateUserProfileDTO)[] = ["name"];
    const invalidFields = Object.keys(data).filter((key) => !ALLOWED_FIELDS.includes(key as keyof UpdateUserProfileDTO));

    if (invalidFields.length > 0) {
      throw new ForbiddenError(`Not allowed to update: ${invalidFields.join((", "))}`);
    }

    const user = await this.userRepo.findById(userIdFromToken);
    if (!user) {
      throw new NotFoundError("User doesn't exist");
    }

    const updatedUser = new User({
      ...user,
      ...data
    });
    return this.userRepo.update(user.id, updatedUser);
  }

  async deleteAccount(email: string): Promise<User> {
    return this.userRepo.delete(email);
  }
}