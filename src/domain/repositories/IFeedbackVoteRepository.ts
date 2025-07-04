import { FeedbackVote } from "../entities/FeedbackVote";


export interface IFeedbackVoteRepository {
  find(userId: string, feedbackId: string): Promise<FeedbackVote | null>;

  create(userId: string, feedbackId: string): Promise<FeedbackVote>;
}