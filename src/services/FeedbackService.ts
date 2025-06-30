import { Role } from "../domain/entities/User";
import { Feedback } from "../domain/entities/Feedback";
import { CreateFeedbackDTO } from "../domain/repositories/IFeedbackRepository";


export interface FeedbackService {
  createFeedback(data: CreateFeedbackDTO): Promise<Feedback>;

  findById(id: string): Promise<Feedback | null>;

  list(): Promise<Feedback[]>;

  upvote(id: string): Promise<void>;

  delete(feedbackId: string, userId: string, role: Role): Promise<void>;
}
