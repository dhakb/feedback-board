import { generateUUID } from "../utils/uuid";
import ICommentService from "./ICommentService";
import { Comment } from "../domain/entities/Comment";
import { CreateCommentDTO, ICommentRepository } from "../domain/repositories/ICommentRepository";


export class CommentServiceImpl implements ICommentService {
  constructor(private readonly commentRepo: ICommentRepository) {
  }

  async create(data: CreateCommentDTO): Promise<Comment> {
    const comment = new Comment({
      id: generateUUID(),
      content: data.content,
      authorId: data.authorId,
      feedbackId: data.feedbackId
    });
    return await this.commentRepo.create(comment);
  }

  async findAllByFeedbackId(feedbackId: string): Promise<Comment[]> {
    return await this.commentRepo.findAllByFeedbackId(feedbackId);
  }
}