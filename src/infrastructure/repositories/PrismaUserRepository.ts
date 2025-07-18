import { User } from "../../domain/entities/User";
import { PrismaClient } from "../../../generated/prisma";
import { IUserRepository } from "../../domain/repositories/IUserRepository";


const prisma = new PrismaClient();

export class PrismaUserRepository implements IUserRepository {
  async create(data: User): Promise<User> {
    return prisma.user.create({data});
  }

  async findByEmail(email: string): Promise<User | null> {
    return prisma.user.findUnique({where: {email}});
  }

  async findById(id: string): Promise<User | null> {
    return prisma.user.findUnique({where: {id}});
  }

  async update(email: string, data: Partial<User>): Promise<User> {
    return prisma.user.update({where: {email}, data});
  }

  async delete(email: string): Promise<User> {
    return prisma.user.delete({where: {email}});
  }
}