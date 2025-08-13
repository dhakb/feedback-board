import type {Request, Response } from "express";

import { IUserService } from "../services/user/IUserService";


export class UserController {
  constructor(private readonly service: IUserService) {
  }

  async updateProfile(req: Request, res: Response) {
    const {email, ...data} = req.body;

    const user = await this.service.updateUserProfile(req.user!.userId, email, data);

    res.status(200).json({
      status: "success",
      data: {
        user
      }
    });
  }
}