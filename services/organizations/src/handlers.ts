import { Request, Response } from 'express';
import { organizationSchema } from '@edunet/validation';
import { 
  findOrganizationById, 
  findOrganizationByCode, 
  createOrganization, 
  updateOrganization,
  listOrganizations 
} from './db';

export async function createOrganizationHandler(req: Request, res: Response) {
  try {
    const data = organizationSchema.parse(req.body);
    
    const existing = await findOrganizationByCode(data.code);
    if (existing) {
      return res.status(409).json({ error: 'Organization code already exists' });
    }

    const org = await createOrganization(data);
    res.status(201).json(org);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}

export async function getOrganizationHandler(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const org = await findOrganizationById(id);
    
    if (!org) {
      return res.status(404).json({ error: 'Organization not found' });
    }
    
    res.json(org);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}

export async function updateOrganizationHandler(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const data = req.body;
    
    const existing = await findOrganizationById(id);
    if (!existing) {
      return res.status(404).json({ error: 'Organization not found' });
    }

    const org = await updateOrganization(id, data);
    res.json(org);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}

export async function listOrganizationsHandler(req: Request, res: Response) {
  try {
    const limit = parseInt(req.query.limit as string) || 50;
    const offset = parseInt(req.query.offset as string) || 0;
    
    const orgs = await listOrganizations(limit, offset);
    res.json(orgs);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}
