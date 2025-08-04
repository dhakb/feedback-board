import { User } from "../../domain/entities/User";
import { Feedback } from "../../domain/entities/Feedback";
import { Comment } from "../../domain/entities/Comment";

export const mockUser = new User({
  id: "user-1",
  name: "Test User",
  email: "test@example.com",
  password: "hashed-password",
  role: "USER",
  createdAt: new Date()
});

export const mockFeedback = new Feedback({
  id: "feedback-1",
  title: "Dark mode",
  description: "Add dark mode support",
  category: "UI",
  status: "OPEN",
  upvotes: 0,
  authorId: "user-1",
  createdAt: new Date()
});


export const mockComment = new Comment({
  id: "comment-1",
  content: "This will be the banger if added!",
  feedbackId: "feedback-1",
  authorId: "user-1",
  createdAt: new Date()
});