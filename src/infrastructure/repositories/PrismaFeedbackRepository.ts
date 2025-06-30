import { PrismaClient } from "../../../generated/prisma";
import { Feedback } from "../../domain/entities/Feedback";
import {
  IFeedbackRepository,
  CreateFeedbackDTO,
  UpdateFeedbackDTO
} from "../../domain/repositories/IFeedbackRepository";


const prisma = new PrismaClient();

export class PrismaFeedbackRepository implements IFeedbackRepository {
  async create(data: CreateFeedbackDTO): Promise<Feedback> {
    return prisma.feedback.create({
      data: {
        ...data,
        status: "OPEN"
      }
    });
  }

  async findById(id: string): Promise<Feedback | null> {
    return prisma.feedback.findUnique({where: {id}});
  }

  async list(): Promise<Feedback[]> {
    return prisma.feedback.findMany({orderBy: {createdAt: "desc"}});
  }

  async upvote(id: string): Promise<void> {
    await prisma.feedback.update({
      where: {id},
      data: {upvotes: {increment: 1}}
    });
  }

  async delete(id: string): Promise<void> {
    await prisma.feedback.delete({where: {id}});
  }

  async update(id: string, data: UpdateFeedbackDTO): Promise<Feedback> {
    return prisma.feedback.update({where: {id}, data});
  }
}
