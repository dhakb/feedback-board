import type { Response } from "express";

import { IUserService } from "../services/IUserService";
import { AuthRequest } from "../middleware/authenticate.middleware";


export class UserController {
  constructor(private readonly service: IUserService) {
  }

  async updateProfile(req: AuthRequest, res: Response) {
    const {email, ...data} = req.body;

    const user = await this.service.updateUserProfile(req.user!.userId, email, data);
    res.status(200).json({user});
  }
}