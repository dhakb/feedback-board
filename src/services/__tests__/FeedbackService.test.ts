import { IFeedbackRepository } from "../../domain/repositories/IFeedbackRepository";
import { Feedback } from "../../domain/entities/Feedback";
import { FeedbackServiceImpl } from "../FeedbackServiceImpl";
import { ForbiddenError } from "../../errors/ApiError";


const mockFeedback: Feedback = {
  id: "feedback-1",
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
      upvote: jest.fn(),
      delete: jest.fn(),
      update: jest.fn().mockResolvedValue(mockFeedback)
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
    const result = await feedbackService.findById("feedback-1");

    expect(feedbackRepository.findById).toHaveBeenCalledWith("feedback-1");
    expect(result?.id).toBe("feedback-1");
  });

  it("should return list of feedbacks", async () => {
    const result = await feedbackService.list();

    expect(feedbackRepository.list).toHaveBeenCalled();
    expect(result).toHaveLength(1);
  });

  it("should upvote feedback", async () => {
    await feedbackService.upvote("feedback-1");

    expect(feedbackRepository.upvote).toHaveBeenCalledWith("feedback-1");
  });

  describe("FeedbackService.delete", () => {
    it("should allow the author to delete their feedback", async () => {
      await feedbackService.delete("feedback-1", "user-1", "USER");

      expect(feedbackRepository.delete).toHaveBeenCalledWith("feedback-1");
    });

    it("should allow the admin to delete any feedback", async () => {
      await feedbackService.delete("feedback-1", "admin-1", "ADMIN");

      expect(feedbackRepository.delete).toHaveBeenCalledWith("feedback-1");
    });

    it("should throw if non-author and non-admin tries to delete feedback", async () => {
      await expect(feedbackService.delete("feedback-1", "unauthorized-user", "USER")).rejects.toThrow(ForbiddenError);

      expect(feedbackRepository.delete).not.toHaveBeenCalled();
    });
  });

  describe("FeedbackService.update", () => {
    it("should allow the author to update their feedback partially", async () => {
      const input = {
        title: "Updated Title",
        description: "Updated Description",
        category: "Updated Category"
      };

      feedbackRepository.update.mockReset();
      feedbackRepository.update.mockResolvedValue({...mockFeedback, ...input});

      const feedback = await feedbackService.updateFeedbackByUser("feedback-1", "user-1", input);

      expect(feedbackRepository.update).toHaveBeenCalledWith("feedback-1", input);
      expect(feedback.title).toBe("Updated Title");
      expect(feedback.description).toBe("Updated Description");
      expect(feedback.category).toBe("Updated Category");
    });

    it("should allow the admin to update any feedback status", async () => {
      feedbackRepository.update.mockReset();
      feedbackRepository.update.mockResolvedValue({...mockFeedback, status: "COMPLETED"});
      const feedback = await feedbackService.updateFeedBackStatusByAdmin("feedback-1", "COMPLETED");

      expect(feedbackRepository.update).toHaveBeenCalledWith("feedback-1", {status: "COMPLETED"});
      expect(feedback.status).toBe("COMPLETED");
    });
  });
});