import { Comment } from "../entities/Comment";


export interface CreateCommentDTO {
  content: string;
  authorId: string;
  feedbackId: string;
}

export interface ICommentRepository {
  create(data: CreateCommentDTO): Promise<Comment>;

  findAllByFeedbackId(feedbackId: string): Promise<Comment[]>;
}