import { Feedback } from "../../domain/entities/Feedback";
import { FeedbackServiceImpl } from "../FeedbackServiceImpl";
import { BadRequestError, ForbiddenError, NotFoundError } from "../../errors/ApiError";
import { IFeedbackVoteRepository } from "../../domain/repositories/IFeedbackVoteRepository";
import {
  CreateFeedbackDTO,
  IFeedbackRepository,
  UpdateFeedbackDTO
} from "../../domain/repositories/IFeedbackRepository";
import { FeedbackVote } from "../../domain/entities/FeedbackVote";


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

describe("FeedbackService", () => {
  let feedbackRepository: jest.Mocked<IFeedbackRepository>;
  let feedbackVoteRepository: jest.Mocked<IFeedbackVoteRepository>;

  let feedbackService: FeedbackServiceImpl;

  beforeEach(() => {
    feedbackRepository = {
      create: jest.fn(),
      findById: jest.fn(),
      list: jest.fn(),
      delete: jest.fn(),
      update: jest.fn(),
      incrementUpvotes: jest.fn()
    };

    feedbackVoteRepository = {
      find: jest.fn(),
      create: jest.fn()
    };

    feedbackService = new FeedbackServiceImpl(feedbackRepository, feedbackVoteRepository);

    jest.resetAllMocks();
  });

  describe("FeedbackService.create", () => {
    it("should create a Feedback, pass it to repository and return", async () => {
      feedbackRepository.create.mockResolvedValue(mockFeedback);

      const input: CreateFeedbackDTO = {
        title: mockFeedback.title,
        description: mockFeedback.description,
        category: mockFeedback.category,
        authorId: mockFeedback.authorId
      };

      const createdFeedback = await feedbackService.create(input);

      const callArg = feedbackRepository.create.mock.calls[0][0];

      expect(feedbackRepository.create).toHaveBeenCalledTimes(1);
      expect(createdFeedback).toBeInstanceOf(Feedback);
      expect(callArg).toBeInstanceOf(Feedback);
      expect(callArg.id).toBeDefined();
      expect(callArg.status).toBe("OPEN");
      expect(callArg.upvotes).toBe(0);
    });
  });

  describe("FeedbackService.findById", () => {
    it("should return feedback by ID", async () => {
      feedbackRepository.findById.mockResolvedValue(mockFeedback);

      const result = await feedbackService.findById("feedback-1");

      expect(feedbackRepository.findById).toHaveBeenCalledWith("feedback-1");
      expect(result?.id).toBe("feedback-1");
    });

    it("should throw NotFoundError if feedback doesn't exist", async () => {
      feedbackRepository.findById.mockResolvedValue(null);

      await expect(feedbackService.findById("feedback-1")).rejects.toThrow(NotFoundError);
    });
  });

  describe("FeedbackService.list", () => {
    it("should return list of feedbacks", async () => {
      feedbackRepository.list.mockResolvedValue([mockFeedback]);

      const result = await feedbackService.list();

      expect(feedbackRepository.list).toHaveBeenCalled();
      expect(result).toHaveLength(1);
    });
  });

  describe("FeedbackService.upvote", () => {
    beforeEach(() => {
      feedbackRepository.findById.mockResolvedValue(mockFeedback);
    });

    it("should upvote feedback if user hasn’t voted yet", async () => {
      await feedbackService.upvote("user-1", "feedback-1");

      const callArg = feedbackVoteRepository.create.mock.calls[0][0];

      expect(feedbackVoteRepository.find).toHaveBeenCalledWith("user-1", "feedback-1");
      expect(feedbackVoteRepository.create).toHaveBeenCalled();
      expect(feedbackRepository.incrementUpvotes).toHaveBeenCalledWith("feedback-1");
      expect(callArg).toBeInstanceOf(FeedbackVote);
    });

    it("should throw ForbiddenError if user already voted", async () => {
      feedbackVoteRepository.find.mockResolvedValue({
        userId: "user-1",
        feedbackId: "feedback-1",
        createdAt: new Date()
      });

      await expect(feedbackService.upvote("user-1", "feedback-1")).rejects.toThrow(ForbiddenError);

      expect(feedbackVoteRepository.create).not.toHaveBeenCalled();
      expect(feedbackRepository.incrementUpvotes).not.toHaveBeenCalled();
    });

    it("should throw BadRequestError is feedback doesn't exist", async () => {
      feedbackRepository.findById.mockResolvedValue(null);

      await expect(feedbackService.upvote("user-1", "feedback-1")).rejects.toThrow(BadRequestError);

      expect(feedbackVoteRepository.create).not.toHaveBeenCalled();
      expect(feedbackRepository.incrementUpvotes).not.toHaveBeenCalled();
    });
  });

  describe("FeedbackService.delete", () => {
    beforeEach(() => {
      feedbackRepository.findById.mockResolvedValue(mockFeedback);
    });

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
      const input: UpdateFeedbackDTO = {
        title: "Updated Title",
        description: "Updated Description",
        category: "Updated Category"
      };

      feedbackRepository.findById.mockResolvedValue(mockFeedback);
      feedbackRepository.update.mockResolvedValue({...mockFeedback, ...input});

      const updatedFeedback = await feedbackService.updateFeedbackByUser("feedback-1", "user-1", input);

      expect(feedbackRepository.update).toHaveBeenCalledTimes(1);
      expect(updatedFeedback.title).toBe("Updated Title");
      expect(updatedFeedback.description).toBe("Updated Description");
      expect(updatedFeedback.category).toBe("Updated Category");
    });

    it("should throw ForbiddenError if author tries to update status of the feedback", async () => {
      const input: UpdateFeedbackDTO = {
        status: "COMPLETED"
      };

      feedbackRepository.update.mockResolvedValue({...mockFeedback, ...input});

      await expect(feedbackService.updateFeedbackByUser("feedback-1", "user-1", input)).rejects.toThrow(ForbiddenError);
      expect(feedbackRepository.update).not.toHaveBeenCalled();
    });

    it("should throw ForbiddenError if author tries update not allowed fields of the feedback", async () => {
      const input = {
        upvotes: 20,
        authorId: "user-2",
        id: "feedback-2",
        createAt: "2025-06-30T00:00:00.000Z"
      } as UpdateFeedbackDTO;

      const invalidFields = Object.keys(input);

      await expect(feedbackService.updateFeedbackByUser("feedback-1", "user-1", input)).rejects.toThrow(ForbiddenError);
      await expect(feedbackService.updateFeedbackByUser("feedback-1", "user-1", input)).rejects.toThrow(`Not allowed to update: ${invalidFields.join((", "))}`);

      expect(feedbackRepository.update).not.toHaveBeenCalled();
    });

    it("should allow the admin to update any feedback status", async () => {
      feedbackRepository.findById.mockResolvedValue(mockFeedback);
      feedbackRepository.update.mockResolvedValue({...mockFeedback, status: "COMPLETED"});

      const feedback = await feedbackService.updateFeedBackStatusByAdmin("feedback-1", "COMPLETED");

      expect(feedbackRepository.update).toHaveBeenCalledWith("feedback-1", {status: "COMPLETED"});
      expect(feedback.status).toBe("COMPLETED");
    });
  });
});