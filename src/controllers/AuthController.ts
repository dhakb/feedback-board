import type { Request, Response } from "express";
import { IAuthService } from "../services/auth/IAuthService";


export class AuthController {
  constructor(private readonly authService: IAuthService) {
  }

  async register(req: Request, res: Response) {
    const {name, email, password} = req.body;

    const user = await this.authService.register(name, email, password);

    res.status(201).json({
      status: "success",
      data: {
        user
      }
    });
  }

  async login(req: Request, res: Response) {
    const {email, password} = req.body;

    const result = await this.authService.login(email, password);

    res.status(200).json({
      status: "success",
      data: {
        result
      }
    });
  }
}