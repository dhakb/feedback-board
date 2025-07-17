import { Comment } from "../../domain/entities/Comment";
import { CreateCommentDTO, ICommentRepository } from "../../domain/repositories/ICommentRepository";
import { CommentServiceImpl } from "../comment/CommentServiceImpl";


const mockComment = new Comment({
  id: "comment-1",
  content: "This will be the banger if added!",
  feedbackId: "feedback-1",
  authorId: "user-1",
  createdAt: new Date()
});


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

  it("should create a Comment, pass it to repository and return", async () => {
    const input: CreateCommentDTO = {
      content: mockComment.content,
      feedbackId: mockComment.feedbackId,
      authorId: mockComment.authorId
    };

    const createdComment = await commentService.create(input);

    const callArg = commentRepository.create.mock.calls[0][0];

    expect(commentRepository.create).toHaveBeenCalled();
    expect(createdComment).toBeInstanceOf(Comment);
    expect(callArg).toBeInstanceOf(Comment);
    expect(callArg.id).toBeDefined();
    expect(callArg.content).toBe(input.content);
    expect(callArg.authorId).toBe(input.authorId);
    expect(callArg.feedbackId).toBe(input.feedbackId);
  });

  it("should return all comment by feedback ID", async () => {
    const result = await commentService.findAllByFeedbackId("1");

    expect(commentRepository.findAllByFeedbackId).toHaveBeenCalledWith("1");
    expect(result).toHaveLength(2);
  });
});
