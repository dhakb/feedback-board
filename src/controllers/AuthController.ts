import type { Request, Response } from "express";
import { IAuthService } from "../services/IAuthService";


export class AuthController {
  constructor(private readonly authService: IAuthService) {
  }

  async register(req: Request, res: Response) {
    const {name, email, password} = req.body;

    try {
      const user = await this.authService.register(name, email, password);
      res.status(201).json({user});
    } catch (e) {
      res.status(400).json({error: (e as Error).message});
    }
  }

  async login(req: Request, res: Response) {
    const {email, password} = req.body;

    try {
      const result = await this.authService.login(email, password);
      res.status(200).json(result);
    } catch (e) {
      res.status(400).json({error: (e as Error).message});
    }
  }
}