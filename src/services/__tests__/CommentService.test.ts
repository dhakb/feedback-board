import { Comment } from "../../domain/entities/Comment";
import { ICommentRepository } from "../../domain/repositories/ICommentRepository";
import { CommentServiceImpl } from "../CommentServiceImpl";


const mockComment: Comment = {
  id: "1",
  content: "This will be the banger if added!",
  feedbackId: "feedback-1",
  authorId: "user-1",
  createdAt: new Date()
};


describe("ICommentService", () => {
  let commentRepository: jest.Mocked<ICommentRepository>;
  let commentService: CommentServiceImpl;

  beforeEach(() => {
    commentRepository = {
      create: jest.fn().mockResolvedValue(mockComment),
      findAllByFeedbackId: jest.fn().mockResolvedValue([mockComment, {...mockComment, id: "2"}])
    };

    commentService = new CommentServiceImpl(commentRepository);
  });

  it("should create a comment and return it", async () => {
    const input = {
      content: mockComment.content,
      feedbackId: mockComment.feedbackId,
      authorId: mockComment.authorId
    };
    const result = await commentService.createComment(input);

    expect(commentRepository.create).toHaveBeenCalledWith(input);
    expect(result.content).toBe(input.content);
    expect(result.authorId).toBe(input.authorId);
    expect(result.feedbackId).toBe(input.feedbackId);
  });

  it("should return all comment by feedback ID", async () => {
    const result = await commentService.findAllByFeedbackId("1");

    expect(commentRepository.findAllByFeedbackId).toHaveBeenCalledWith("1");
    expect(result).toHaveLength(2);
  });
});
