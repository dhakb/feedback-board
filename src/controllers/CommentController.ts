import type { Request, Response } from "express";
import CommentService from "../services/CommentService";


export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  async create(req: Request, res: Response) {
    const {content, feedbackId, authorId} = req.body;
    const comment = await this.commentService.createComment({content, feedbackId, authorId});

    res.status(201).json(comment);
  }

  async findAllCommentByFeedback(req: Request, res: Response) {
    const {feedbackId} = req.params;

    const comments = await this.commentService.findAllByFeedbackId(feedbackId);

    res.status(200).json(comments);
  }
}