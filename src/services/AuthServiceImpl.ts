import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { Role, User } from "../domain/entities/User";
import { IUserRepository } from "../domain/repositories/IUserRepository";
import { IAuthService, LoginResult } from "./IAuthService";


const JWT_SECRET = process.env.JWT_SECRET || "dev-jwt-secret";


export class AuthServiceImpl implements IAuthService {
  constructor(private readonly userRepo: IUserRepository) {
  }

  async register(name: string, email: string, password: string): Promise<Omit<User, "passwordHash">> {
    const existing = await this.userRepo.findByEmail(email);
    if (existing) {
      throw new Error("Email already in use");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await this.userRepo.create({name, email, passwordHash: hashedPassword});

    const {passwordHash, ...safeUser} = user;
    return safeUser;
  }

  async login(email: string, password: string): Promise<LoginResult> {
    const user = await this.userRepo.findByEmail(email);
    if (!user) {
      throw new Error("Invalid credentials!");
    }

    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) {
      throw new Error("Invalid credentials");
    }

    const token = jwt.sign({userId: user.id, role: user.role}, JWT_SECRET, {expiresIn: "7d"});

    const {passwordHash, ...safeUser} = user;
    return {
      user: safeUser,
      token
    };
  }

  verifyToken(token: string): { userId: string; role: Role } {
    return jwt.verify(token, JWT_SECRET) as { userId: string; role: Role };
  }
}