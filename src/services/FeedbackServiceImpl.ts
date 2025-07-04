import { FeedbackService } from "./FeedbackService";
import { Feedback, FeedbackStatus } from "../domain/entities/Feedback";
import { CreateFeedbackDTO, UpdateFeedbackDTO, IFeedbackRepository } from "../domain/repositories/IFeedbackRepository";
import { Role } from "../domain/entities/User";
import { ForbiddenError, NotFoundError } from "../errors/ApiError";
import { IFeedbackVoteRepository } from "../domain/repositories/IFeedbackVoteRepository";


export class FeedbackServiceImpl implements FeedbackService {
  constructor(private readonly feedbackRepo: IFeedbackRepository, private readonly feedbackVoteRepo: IFeedbackVoteRepository) {
  }

  async createFeedback(data: CreateFeedbackDTO): Promise<Feedback> {
    return await this.feedbackRepo.create(data);
  }

  async findById(id: string): Promise<Feedback | null> {
    const feedback = await this.feedbackRepo.findById(id);
    if (!feedback) {
      throw new NotFoundError("Feedback with given ID not found");
    }

    return await this.feedbackRepo.findById(id);
  }

  async list(): Promise<Feedback[]> {
    return await this.feedbackRepo.list();
  }

  async upvote(userId: string, feedbackId: string): Promise<void> {
    const existingUpvote = await this.feedbackVoteRepo.find(userId, feedbackId);
    if (existingUpvote) {
      throw new ForbiddenError("You've already upvoted this feedback");
    }

    await this.feedbackVoteRepo.create(userId, feedbackId);

    return await this.feedbackRepo.upvote(feedbackId);
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

  async updateFeedbackByUser(feedbackId: string, userId: string, data: Omit<UpdateFeedbackDTO, "status">): Promise<Feedback> {
    const ALLOWED_FIELDS: (keyof UpdateFeedbackDTO)[] = ["title", "description", "category"];
    const invalidFields = Object.keys(data).filter((key) => !ALLOWED_FIELDS.includes(key as keyof UpdateFeedbackDTO));

    if (invalidFields.length > 0) {
      throw new ForbiddenError(`Not allowed to update: ${invalidFields.join((", "))}`);
    }

    const feedback = await this.feedbackRepo.findById(feedbackId);
    if (!feedback) {
      throw new NotFoundError("Feedback not found");
    }

    const isAuthor = feedback.authorId === userId;
    if (!isAuthor) {
      throw new ForbiddenError("Not allowed to update this feedback");
    }

    return await this.feedbackRepo.update(feedbackId, data);
  }

  async updateFeedBackStatusByAdmin(feedbackId: string, status: FeedbackStatus): Promise<Feedback> {
    const feedback = await this.feedbackRepo.findById(feedbackId);
    if (!feedback) {
      throw new NotFoundError("Feedback not found");
    }

    return await this.feedbackRepo.update(feedbackId, {status});
  }
}