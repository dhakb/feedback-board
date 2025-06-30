import bcrypt from "bcrypt";
import { User } from "../../domain/entities/User";
import { PrismaClient } from "../../../generated/prisma";
import { CreateUserDto, IUserRepository } from "../../domain/repositories/IUserRepository";


const prisma = new PrismaClient();

export class PrismaUserRepository implements IUserRepository {
  async create(data: CreateUserDto): Promise<User> {
    const passwordHash = await bcrypt.hash(data.password, 10);

    return prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        passwordHash,
        role: "USER"
      }
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    return prisma.user.findUnique({where: {email}});
  }

  findById(id: string): Promise<User | null> {
    return prisma.user.findUnique({where: {id}});
  }
}