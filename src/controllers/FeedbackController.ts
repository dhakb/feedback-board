import { Request, Response } from "express";
import { IFeedbackService } from "../services/feeback/IFeedbackService";
import { AuthRequest } from "../middleware/authenticate.middleware";
import type { Role } from "../domain/entities/User";


export class FeedbackController {
  constructor(private readonly service: IFeedbackService) {
  }

  async create(req: Request, res: Response) {
    const {title, description, category, authorId} = req.body;
    const feedback = await this.service.create({title, description, category, authorId});

    res.status(201).json({
      status: "success",
      data: {
        feedback
      }
    });
  }

  async list(_req: Request, res: Response) {
    const feedbacks = await this.service.list();

    res.status(200).json({
      status: "success",
      data: {
        feedbacks
      }
    });
  }

  async getById(req: Request, res: Response) {
    const feedback = await this.service.findById(req.params.id);

    res.status(200).json({
      status: "success",
      data: {
        feedback
      }
    });
  }

  async upvote(req: AuthRequest, res: Response) {
    await this.service.upvote(req.user!.userId, req.params.id);

    res.status(204).send({
      status: "success",
      data: {}
    });
  }

  async delete(req: AuthRequest, res: Response) {
    const feedbackId = req.params.id;
    const userId = req.user?.userId || "";
    const role = req.user?.role as Role || "";

    await this.service.delete(feedbackId, userId, role);

    res.status(204).send({
      status: "success",
      data: {}
    });
  }

  async updateFeedbackByUser(req: AuthRequest, res: Response) {
    const data = req.body;
    const feedbackId = req.params.id;
    const userId = req.user!.userId;

    const feedback = await this.service.updateByUser(feedbackId, userId, data);

    res.status(200).json({
      status: "success",
      data: {
        feedback
      }
    });
  }

  async updateFeedbackStatusByAdmin(req: AuthRequest, res: Response) {
    const {id: feedbackId} = req.params;
    const {status} = req.body;

    const feedback = await this.service.updateStatusByAdmin(feedbackId, status);

    res.status(200).json({
      status: "success",
      data: {
        feedback
      }
    });
  }
}
