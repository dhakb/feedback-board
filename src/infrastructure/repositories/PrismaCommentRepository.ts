import { Comment } from "../../domain/entities/Comment";
import { PrismaClient } from "../../../generated/prisma";
import { ICommentRepository } from "../../domain/repositories/ICommentRepository";


const prisma = new PrismaClient();


export class PrismaCommentRepository implements ICommentRepository {
  async create(data: Comment): Promise<Comment> {
    return prisma.comment.create({data});
  }

  async findAllByFeedbackId(id: string): Promise<Comment[]> {
    return prisma.comment.findMany({where: {feedbackId: id}});
  }
}