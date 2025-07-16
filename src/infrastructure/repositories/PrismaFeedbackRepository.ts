import { PrismaClient } from "../../../generated/prisma";
import { Feedback } from "../../domain/entities/Feedback";
import { IFeedbackRepository, UpdateFeedbackDTO } from "../../domain/repositories/IFeedbackRepository";


const prisma = new PrismaClient();

export class PrismaFeedbackRepository implements IFeedbackRepository {
  async create(data: Feedback): Promise<Feedback> {
    return prisma.feedback.create({data});
  }

  async findById(id: string): Promise<Feedback | null> {
    return prisma.feedback.findUnique({where: {id}});
  }

  async list(): Promise<Feedback[]> {
    return prisma.feedback.findMany({orderBy: {createdAt: "desc"}});
  }

  async incrementUpvotes(id: string): Promise<void> {
    await prisma.feedback.update({
      where: {id},
      data: {upvotes: {increment: 1}}
    });
  }

  async delete(id: string): Promise<void> {
    await prisma.feedback.delete({where: {id}});
  }

  async update(id: string, data: Partial<Feedback>): Promise<Feedback> {
    return prisma.feedback.update({where: {id}, data});
  }
}
