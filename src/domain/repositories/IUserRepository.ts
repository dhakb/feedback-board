import { User } from "../entities/User";


export interface CreateUserDto {
  name: string;
  email: string;
  passwordHash: string;
  role?: "ADMIN" | "USER";
}

export interface IUserRepository {
  create(data: CreateUserDto): Promise<User>;

  findByEmail(email: string): Promise<User | null>;

  findById(id: string): Promise<User | null>;
}