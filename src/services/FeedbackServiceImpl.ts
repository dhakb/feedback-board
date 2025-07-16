import { generateUUID } from "../utils/uuid";
import { Role } from "../domain/entities/User";
import { IFeedbackService } from "./IFeedbackService";
import { Feedback, FeedbackStatus } from "../domain/entities/Feedback";
import { BadRequestError, ForbiddenError, NotFoundError } from "../errors/ApiError";
import { IFeedbackVoteRepository } from "../domain/repositories/IFeedbackVoteRepository";
import { UpdateFeedbackDTO, IFeedbackRepository, CreateFeedbackDTO } from "../domain/repositories/IFeedbackRepository";


export class FeedbackServiceImpl implements IFeedbackService {
  constructor(private readonly feedbackRepo: IFeedbackRepository, private readonly feedbackVoteRepo: IFeedbackVoteRepository) {
  }

  async create(data: CreateFeedbackDTO): Promise<Feedback> {
    const feedback = new Feedback({
      id: generateUUID(),
      title: data.title,
      description: data.description,
      category: data.category,
      status: "OPEN",
      authorId: data.authorId,
      upvotes: 0
    });
    return await this.feedbackRepo.create(feedback);
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
    const feedback = await this.feedbackRepo.findById(feedbackId);
    if (!feedback) {
      throw new BadRequestError("Feedback with given ID doesn't exist");
    }

    const existingUpvote = await this.feedbackVoteRepo.find(userId, feedbackId);
    if (existingUpvote) {
      throw new ForbiddenError("You've already upvoted this feedback");
    }

    await this.feedbackVoteRepo.create(userId, feedbackId);

    return await this.feedbackRepo.incrementUpvotes(feedbackId);
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

    const updatedFeedback = new Feedback({
      ...feedback,
      ...data
    });
    return await this.feedbackRepo.update(feedbackId, updatedFeedback);
  }

  async updateFeedBackStatusByAdmin(feedbackId: string, status: FeedbackStatus): Promise<Feedback> {
    const feedback = await this.feedbackRepo.findById(feedbackId);
    if (!feedback) {
      throw new NotFoundError("Feedback not found");
    }

    return await this.feedbackRepo.update(feedbackId, {status});
  }
}