import { generateUUID } from "../../utils/uuid";
import ICommentService from "./ICommentService";
import { Comment } from "../../domain/entities/Comment";
import { CreateCommentDTO, ICommentRepository } from "../../domain/repositories/ICommentRepository";
import { IFeedbackRepository } from "../../domain/repositories/IFeedbackRepository";
import { BadRequestError, NotFoundError } from "../../errors/ApiError";
import { IUserRepository } from "../../domain/repositories/IUserRepository";


export class CommentServiceImpl implements ICommentService {
  constructor(
    private readonly commentRepo: ICommentRepository,
    private readonly feedbackRepo: IFeedbackRepository,
    private readonly userRepo: IUserRepository) {
  }

  async create(data: CreateCommentDTO): Promise<Comment> {
    const feedback = await this.feedbackRepo.findById(data.feedbackId);
    if (!feedback) {
      throw new NotFoundError("Feedback with given ID not found");
    }

    const user = await this.userRepo.findById(data.authorId);
    if (!user) {
      throw new BadRequestError("Author ID is invalid or does not exist");
    }

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