import { User } from "../entities/User";


export interface CreateUserDto {
  name: string;
  email: string;
  password: string;
  role?: "ADMIN" | "USER";
}

export interface UpdateUserProfileDTO {
  name?: string;
}

export interface IUserRepository {
  create(data: User): Promise<User>;

  findByEmail(email: string): Promise<User | null>;

  findById(id: string): Promise<User | null>;

  update(email: string, data: Partial<User>): Promise<User>;

  delete(email: string): Promise<User>;
}