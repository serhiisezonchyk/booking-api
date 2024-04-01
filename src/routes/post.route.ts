import { Request, Response, Router } from 'express';

const router: Router = Router();

router.get('/', (req: Request, res: Response) => {
  res.send('its works');
});
router.put('/', (req: Request, res: Response) => {
  res.send('its works');
});
router.post('/', (req: Request, res: Response) => {
  res.send('its works');
});
router.delete('/', (req: Request, res: Response) => {
  res.send('its works');
});

export default router;
