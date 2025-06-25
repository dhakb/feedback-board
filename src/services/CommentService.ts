import { Comment } from "../domain/entities/Comment";
import { CreateCommentDTO } from "../domain/repositories/ICommentRepository";


export default interface CommentService {
  createComment(data: CreateCommentDTO): Promise<Comment>;

  findAllByFeedbackId(id: string): Promise<Comment[]>;
}