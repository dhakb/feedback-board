export interface FeedbackVoteProps {
  userId: string;
  feedbackId: string;
  createdAt?: Date;
}

export class FeedbackVote {
  public userId: string;
  public feedbackId: string;
  public createdAt?: Date;

  constructor(props: FeedbackVoteProps) {
    this.userId = props.userId;
    this.feedbackId = props.feedbackId;
    this.createdAt = props.createdAt;
  }
}