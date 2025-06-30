import { FeedbackService } from "./FeedbackService";
import { Feedback } from "../domain/entities/Feedback";
import { CreateFeedbackDTO, IFeedbackRepository } from "../domain/repositories/IFeedbackRepository";
import { Role } from "../domain/entities/User";
import { ForbiddenError, NotFoundError } from "../errors/ApiError";


export class FeedbackServiceImpl implements FeedbackService {
  constructor(private readonly feedbackRepo: IFeedbackRepository) {
  }

  async createFeedback(data: CreateFeedbackDTO): Promise<Feedback> {
    return await this.feedbackRepo.create(data);
  }

  async findById(id: string): Promise<Feedback | null> {
    return await this.feedbackRepo.findById(id);
  }

  async list(): Promise<Feedback[]> {
    return await this.feedbackRepo.list();
  }

  async upvote(id: string): Promise<void> {
    return await this.feedbackRepo.upvote(id);
  }

  async delete(feedbackId: string, userId: string, role: Role): Promise<void> {
    const feedback = await this.feedbackRepo.findById(feedbackId);
    if (!feedback) {
      throw new NotFoundError("Feedback not found");
    }

    const isAuthor = feedback.authorId === userId;
    const isAdmin = role === "ADMIN";

    if (!isAuthor && !isAdmin) {
      throw new ForbiddenError("Not allowed to delete this feedback");
    }

    return await this.feedbackRepo.delete(feedbackId);
  }
}