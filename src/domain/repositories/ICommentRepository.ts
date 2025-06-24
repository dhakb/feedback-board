import { Comment } from "../entities/Comment";


export interface CreateCommentDTO {
  content: string;
  authorId: string;
  feedbackId: string;
}

export interface CommentRepository {
  create(data: CreateCommentDTO): Promise<Comment>;

  findByFeedback(feedbackId: string): Promise<Comment>;
}