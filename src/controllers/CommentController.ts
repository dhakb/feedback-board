import type { Request, Response } from "express";
import ICommentService from "../services/ICommentService";


export class CommentController {
  constructor(private readonly commentService: ICommentService) {
  }

  async create(req: Request, res: Response) {
    const {content, feedbackId, authorId} = req.body;
    const comment = await this.commentService.createComment({content, feedbackId, authorId});

    res.status(201).json({
      status: "success",
      data: {
        comment
      }
    });
  }

  async findAllCommentByFeedback(req: Request, res: Response) {
    const {feedbackId} = req.params;

    const comments = await this.commentService.findAllByFeedbackId(feedbackId);

    res.status(201).json({
      status: "success",
      data: {
        comments
      }
    });
  }
}