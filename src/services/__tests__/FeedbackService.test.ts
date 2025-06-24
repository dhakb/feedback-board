import { FeedBackRepository } from "../../domain/repositories/IFeedbackRepository";
import { Feedback } from "../../domain/entities/Feedback";
import {FeedbackServiceImpl} from "../FeedbackServiceImpl";


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
  let feedbackRepository: jest.Mocked<FeedBackRepository>;
  let feedbackService: FeedbackServiceImpl;

  beforeEach(() => {
    feedbackRepository = {
      create: jest.fn().mockResolvedValue(mockFeedback),
      findById: jest.fn(),
      list: jest.fn(),
      upvote: jest.fn()
    };

    feedbackService = new FeedbackServiceImpl(feedbackRepository);
  });

  it("should create a feedback and return it", async () => {
    const input = {
      title: "Dark mode",
      description: "Add dark mode support",
      category: "UI",
      authorId: "user-1"
    };

    const feedback = await feedbackService.createFeedback(input);

    expect(feedbackRepository.create).toHaveBeenCalledWith(input);
    expect(feedback.title).toBe("Dark mode");
    expect(feedback.authorId).toBe("user-1");
  });
});