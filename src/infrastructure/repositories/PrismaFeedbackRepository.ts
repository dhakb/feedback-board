import { PrismaClient } from '@prisma/client';
import { FeedbackRepository, CreateFeedbackDTO } from '../../domain/repositories/IFeedbackRepository';
import { Feedback } from '../../domain/entities/Feedback';

const prisma = new PrismaClient();

export class PrismaFeedbackRepository implements FeedbackRepository {
  async create(data: CreateFeedbackDTO): Promise<Feedback> {
    return prisma.feedback.create({
      data: {
        ...data,
        status: 'OPEN',
      },
    });
  }

  async findById(id: string): Promise<Feedback | null> {
    return prisma.feedback.findUnique({ where: { id } });
  }

  async list(): Promise<Feedback[]> {
    return prisma.feedback.findMany({ orderBy: { createdAt: 'desc' } });
  }

  async upvote(id: string): Promise<void> {
    await prisma.feedback.update({
      where: { id },
      data: { upvotes: { increment: 1 } },
    });
  }
}
