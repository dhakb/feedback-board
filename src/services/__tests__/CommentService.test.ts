import { Comment } from "../../domain/entities/Comment";
import { CreateCommentDTO, ICommentRepository } from "../../domain/repositories/ICommentRepository";
import { CommentServiceImpl } from "../comment/CommentServiceImpl";
import { IUserRepository } from "../../domain/repositories/IUserRepository";
import { IFeedbackRepository } from "../../domain/repositories/IFeedbackRepository";
import { Feedback } from "../../domain/entities/Feedback";
import { User } from "../../domain/entities/User";


const mockComment = new Comment({
  id: "comment-1",
  content: "This will be the banger if added!",
  feedbackId: "feedback-1",
  authorId: "user-1",
  createdAt: new Date()
});

const mockFeedback = new Feedback({
  id: "feedback-1",
  title: "Dark mode",
  description: "Add dark mode support",
  category: "UI",
  status: "OPEN",
  upvotes: 0,
  authorId: "user-1",
  createdAt: new Date()
});

const mockUser: User = {
  id: "user-1",
  name: "Test User",
  email: "user-test@test.com",
  password: "hashed-password",
  role: "USER",
  createdAt: new Date()
};


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
    const result = await commentService.findAllByFeedbackId("1");

    expect(commentRepository.findAllByFeedbackId).toHaveBeenCalledWith("1");
    expect(result).toHaveLength(2);
  });
});
