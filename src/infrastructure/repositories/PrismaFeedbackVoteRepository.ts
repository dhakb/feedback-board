import { PrismaClient } from "../../../generated/prisma";
import { FeedbackVote } from "../../domain/entities/FeedbackVote";
import { IFeedbackVoteRepository } from "../../domain/repositories/IFeedbackVoteRepository";


const prisma = new PrismaClient();


export class PrismaFeedbackVoteRepository implements IFeedbackVoteRepository {
  async create(userId: string, feedbackId: string): Promise<FeedbackVote> {
    return prisma.feedbackVote.create({data: {userId, feedbackId}});
  }

  find(userId: string, feedbackId: string): Promise<FeedbackVote | null> {
    return prisma.feedbackVote.findUnique({where: {userId_feedbackId: {userId, feedbackId}}});
  }
}