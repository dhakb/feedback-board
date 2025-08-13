import { prisma } from "../prisma";
import { Feedback } from "../../domain/entities/Feedback";
import { IFeedbackRepository } from "../../domain/repositories/IFeedbackRepository";


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
