import { prisma } from "../prisma";
import { FeedbackVote } from "../../domain/entities/FeedbackVote";
import { IFeedbackVoteRepository } from "../../domain/repositories/IFeedbackVoteRepository";



export class PrismaFeedbackVoteRepository implements IFeedbackVoteRepository {
  async create(data: FeedbackVote): Promise<FeedbackVote> {
    return prisma.feedbackVote.create({data});
  }

  async find(userId: string, feedbackId: string): Promise<FeedbackVote | null> {
    return prisma.feedbackVote.findUnique({where: {userId_feedbackId: {userId, feedbackId}}});
  }

  async delete(userId: string, feedbackId: string): Promise<void> {
    await prisma.feedbackVote.delete({where: {userId_feedbackId: {userId, feedbackId}}});
  }

  async deleteAll(feedbackId: string): Promise<void> {
    await prisma.feedbackVote.deleteMany({where: {feedbackId}});
  }
}