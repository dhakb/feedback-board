import { PrismaUserRepository } from "./infrastructure/repositories/PrismaUserRepository";
import { PrismaFeedbackRepository } from "./infrastructure/repositories/PrismaFeedbackRepository";
import { PrismaCommentRepository } from "./infrastructure/repositories/PrismaCommentRepository";
import { PrismaFeedbackVoteRepository } from "./infrastructure/repositories/PrismaFeedbackVoteRepository";

import { AuthServiceImpl } from "./services/auth/AuthServiceImpl";
import { UserServiceImpl } from "./services/user/UserServiceImpl";
import { CommentServiceImpl } from "./services/comment/CommentServiceImpl";
import { FeedbackServiceImpl } from "./services/feeback/FeedbackServiceImpl";

import { AuthController } from "./controllers/AuthController";
import { UserController } from "./controllers/UserController";
import { CommentController } from "./controllers/CommentController";
import { FeedbackController } from "./controllers/FeedbackController";


const userRepository = new PrismaUserRepository();
const feedbackRepository = new PrismaFeedbackRepository();
const commentRepository = new PrismaCommentRepository();
const feedbackVoteRepository = new PrismaFeedbackVoteRepository();


const authService = new AuthServiceImpl(userRepository);
const userService = new UserServiceImpl(userRepository);
const commentService = new CommentServiceImpl(commentRepository, feedbackRepository, userRepository);
const feedbackService = new FeedbackServiceImpl(feedbackRepository, feedbackVoteRepository, userRepository);


export const authController = new AuthController(authService);
export const userController = new UserController(userService);
export const commentController = new CommentController(commentService);
export const feedbackController = new FeedbackController(feedbackService);


export const repositories = {
  userRepository,
  feedbackRepository,
  commentRepository,
  feedbackVoteRepository,
};

export const services = {
  authService,
  userService,
  commentService,
  feedbackService,
};