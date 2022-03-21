import { Request, Response } from 'express';

import { ProfileUserService } from '../services/ProfileUserService';

class ProfileUserController {
  async handle(request: Request, response: Response) {
    const { user_id } = request;

    const profileUserService = new ProfileUserService();

    const user = await profileUserService.execute(user_id);

    return response.status(200).json(user);
  }
}

export { ProfileUserController };
