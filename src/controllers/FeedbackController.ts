import { Request, Response } from "express";
import { FeedbackService } from "../services/FeedbackService";
import { AuthRequest } from "../middleware/authenticate.middleware";
import type { Role } from "../domain/entities/User";


export class FeedbackController {
  constructor(private readonly service: FeedbackService) {
  }

  async create(req: Request, res: Response) {
    const {title, description, category, authorId} = req.body;
    const feedback = await this.service.createFeedback({title, description, category, authorId});
    res.status(201).json(feedback);
  }

  async list(_req: Request, res: Response) {
    const feedbacks = await this.service.list();
    res.json(feedbacks);
  }

  async getById(req: Request, res: Response) {
    const feedback = await this.service.findById(req.params.id);
    if (!feedback) {
      res.status(404).json({error: "Not found"});
      return;
    }
    res.json(feedback);
  }

  async upvote(req: Request, res: Response) {
    await this.service.upvote(req.params.id);
    res.status(204).send();
  }

  async delete(req: AuthRequest, res: Response) {
    const feedbackId = req.params.id;
    const userId = req.user?.userId || "";
    const role = req.user?.role as Role || "";

    await this.service.delete(feedbackId, userId, role);
    res.status(204).send();
  }

  async updateFeedbackByUser(req: AuthRequest, res: Response) {
    const data = req.body;
    const feedbackId = req.params.id;
    const userId = req.user!.userId;

    const feedback = await this.service.updateFeedbackByUser(feedbackId, userId, data);
    res.status(200).json(feedback);
  }

  async updateFeedbackStatusByAdmin(req: AuthRequest, res: Response) {
    const {id: feedbackId} = req.params;
    const {status} = req.body;

    const feedback = await this.service.updateFeedBackStatusByAdmin(feedbackId, status);
    res.status(200).json(feedback);
  }
}
