import { FeedbackService } from "./FeedbackService";
import { Feedback } from "../domain/entities/Feedback";
import { CreateFeedbackDTO, FeedBackRepository } from "../domain/repositories/IFeedbackRepository";


export class FeedbackServiceImpl implements FeedbackService {
  constructor(private readonly feedbackRepo: FeedBackRepository) {
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
}