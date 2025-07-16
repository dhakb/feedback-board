import { Comment } from "../domain/entities/Comment";
import { CreateCommentDTO } from "../domain/repositories/ICommentRepository";


export default interface ICommentService {
  create(data: CreateCommentDTO): Promise<Comment>;

  findAllByFeedbackId(id: string): Promise<Comment[]>;
}