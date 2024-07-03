import { Router, Request, Response } from 'express';
import { HealthController } from '../Controllers/HealthController';

// initiating the router
export const router = Router();

router.get('/', async function (req: Request, res: Response) {
  return res.json({
    message: 'Welcome to ' + process.env.APP_NAME
  });
});
router.get('/health', new HealthController().healthCheck);
