import CommentService from "./CommentService";
import { Comment } from "../domain/entities/Comment";

import { CreateCommentDTO, ICommentRepository } from "../domain/repositories/ICommentRepository";


export class CommentServiceImpl implements CommentService {
  constructor(private readonly commentRepo: ICommentRepository) {
  }

  async createComment(data: CreateCommentDTO): Promise<Comment> {
    return await this.commentRepo.create(data)
  }

  async findAllByFeedbackId(feedbackId:string): Promise<Comment[]> {
    return await this.commentRepo.findAllByFeedbackId(feedbackId)
  }
}