import { Router } from 'express';
import {
  getUserHandler,
  listUsersHandler,
  updateUserHandler,
  updatePasswordHandler,
  verifyUserHandler,
  deleteUserHandler,
} from './handlers';

export function registerRoutes(app: any) {
  const router = Router();

  router.get('/', listUsersHandler);
  router.get('/:id', getUserHandler);
  router.put('/:id', updateUserHandler);
  router.put('/:id/password', updatePasswordHandler);
  router.put('/:id/verify', verifyUserHandler);
  router.delete('/:id', deleteUserHandler);

  app.use('/api/users', router);
}
