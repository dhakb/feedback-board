import { Role } from "../domain/entities/User";
import { Feedback, FeedbackStatus } from "../domain/entities/Feedback";
import { CreateFeedbackDTO, UpdateFeedbackDTO } from "../domain/repositories/IFeedbackRepository";


export interface FeedbackService {
  createFeedback(data: CreateFeedbackDTO): Promise<Feedback>;

  findById(id: string): Promise<Feedback | null>;

  list(): Promise<Feedback[]>;

  upvote(id: string): Promise<void>;

  delete(feedbackId: string, userId: string, role: Role): Promise<void>;

  updateFeedbackByUser(feedbackId: string, userId: string, data: Omit<UpdateFeedbackDTO, "status">): Promise<Feedback>;

  updateFeedBackStatusByAdmin(feedbackId: string, status: FeedbackStatus, role: Role): Promise<Feedback>;
}
