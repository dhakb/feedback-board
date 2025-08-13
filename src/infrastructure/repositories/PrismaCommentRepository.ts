import { prisma } from "../prisma";
import { Comment } from "../../domain/entities/Comment";
import { ICommentRepository } from "../../domain/repositories/ICommentRepository";



export class PrismaCommentRepository implements ICommentRepository {
  async create(data: Comment): Promise<Comment> {
    return prisma.comment.create({data});
  }

  async findAllByFeedbackId(id: string): Promise<Comment[]> {
    return prisma.comment.findMany({where: {feedbackId: id}});
  }
}