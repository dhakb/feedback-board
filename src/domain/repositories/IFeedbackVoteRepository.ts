import { FeedbackVote } from "../entities/FeedbackVote";


export interface IFeedbackVoteRepository {
  find(userId: string, feedbackId: string): Promise<FeedbackVote | null>;

  create(data: FeedbackVote): Promise<FeedbackVote>;

  delete(userId: string, feedbackId: string): Promise<void>

  deleteAll(feedbackId: string): Promise<void>;
}