import { Router } from 'express';

import { AuthenticateUserController } from './controllers/AuthenticateUserController';
import { CreateMessageController } from './controllers/CreateMessageController';
import { GetLast3MessagesController } from './controllers/GetLast3MessagesController';
import { ProfileUserController } from './controllers/ProfileUserController';
import { ensureAuthenticated } from './middlewares/ensureAuthenticated';

const router = Router();

router.post('/authenticate', new AuthenticateUserController().handle);
router.get(
  '/user/profile',
  ensureAuthenticated,
  new ProfileUserController().handle,
);

router.get('/message/last3', new GetLast3MessagesController().handle);
router.post(
  '/message',
  ensureAuthenticated,
  new CreateMessageController().handle,
);

export { router };
