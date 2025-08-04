import { Comment } from "../../domain/entities/Comment";
import { CreateCommentDTO, ICommentRepository } from "../../domain/repositories/ICommentRepository";
import { CommentServiceImpl } from "../comment/CommentServiceImpl";
import { IUserRepository } from "../../domain/repositories/IUserRepository";
import { IFeedbackRepository } from "../../domain/repositories/IFeedbackRepository";
import { mockFeedback, mockComment, mockUser } from "./mocks";


describe("ICommentService", () => {
  let userRepository: jest.Mocked<IUserRepository>;
  let feedbackRepository: jest.Mocked<IFeedbackRepository>;
  let commentRepository: jest.Mocked<ICommentRepository>;
  let commentService: CommentServiceImpl;

  beforeEach(() => {
    commentRepository = {
      create: jest.fn().mockResolvedValue(mockComment),
      findAllByFeedbackId: jest.fn().mockResolvedValue([mockComment, {...mockComment, id: "2"}])
    };
    userRepository = {
      create: jest.fn(),
      findByEmail: jest.fn(),
      findById: jest.fn(),
      update: jest.fn(),
      delete: jest.fn()
    };
    feedbackRepository = {
      create: jest.fn(),
      findById: jest.fn(),
      list: jest.fn(),
      delete: jest.fn(),
      update: jest.fn(),
      incrementUpvotes: jest.fn()
    };

    commentService = new CommentServiceImpl(commentRepository, feedbackRepository, userRepository);
  });

  it("should create a Comment, pass it to repository and return", async () => {
    const input: CreateCommentDTO = {
      content: mockComment.content,
      feedbackId: mockComment.feedbackId,
      authorId: mockComment.authorId
    };

    feedbackRepository.findById.mockResolvedValue(mockFeedback);
    userRepository.findById.mockResolvedValue(mockUser);

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
    feedbackRepository.findById.mockResolvedValue(mockFeedback);

    const result = await commentService.findAllByFeedbackId("1");

    expect(commentRepository.findAllByFeedbackId).toHaveBeenCalledWith("1");
    expect(result).toHaveLength(2);
  });
});
