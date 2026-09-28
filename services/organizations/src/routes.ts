import { Router } from 'express';
import { 
  createOrganizationHandler, 
  getOrganizationHandler, 
  updateOrganizationHandler,
  listOrganizationsHandler 
} from './handlers';

export function registerRoutes(app: any) {
  const router = Router();

  router.post('/', createOrganizationHandler);
  router.get('/', listOrganizationsHandler);
  router.get('/:id', getOrganizationHandler);
  router.put('/:id', updateOrganizationHandler);

  app.use('/api/organizations', router);
}
