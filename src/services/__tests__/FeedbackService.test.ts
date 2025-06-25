import { IFeedbackRepository } from "../../domain/repositories/IFeedbackRepository";
import { Feedback } from "../../domain/entities/Feedback";
import { FeedbackServiceImpl } from "../FeedbackServiceImpl";


const mockFeedback: Feedback = {
  id: "1",
  title: "Dark mode",
  description: "Add dark mode support",
  category: "UI",
  status: "OPEN",
  upvotes: 0,
  authorId: "user-1",
  createdAt: new Date()
};

describe("FeedbackService", () => {
  let feedbackRepository: jest.Mocked<IFeedbackRepository>;
  let feedbackService: FeedbackServiceImpl;

  beforeEach(() => {
    feedbackRepository = {
      create: jest.fn().mockResolvedValue(mockFeedback),
      findById: jest.fn().mockResolvedValue(mockFeedback),
      list: jest.fn().mockResolvedValue([mockFeedback]),
      upvote: jest.fn()
    };

    feedbackService = new FeedbackServiceImpl(feedbackRepository);
  });

  it("should create a feedback and return it", async () => {
    const input = {
      title: mockFeedback.title,
      description: mockFeedback.description,
      category: mockFeedback.category,
      authorId: mockFeedback.authorId
    };

    const feedback = await feedbackService.createFeedback(input);

    expect(feedbackRepository.create).toHaveBeenCalledWith(input);
    expect(feedback.title).toBe("Dark mode");
    expect(feedback.authorId).toBe("user-1");
  });

  it("should return feedback by ID", async () => {
    const result = await feedbackService.findById("1");

    expect(feedbackRepository.findById).toHaveBeenCalledWith("1");
    expect(result?.id).toBe("1");
  });

  it("should return list of feedbacks", async () => {
    const result = await feedbackService.list();

    expect(feedbackRepository.list).toHaveBeenCalled();
    expect(result).toHaveLength(1);
  });

  it("should upvote feedback", async () => {
    await feedbackService.upvote("1");

    expect(feedbackRepository.upvote).toHaveBeenCalledWith("1");
  })
});