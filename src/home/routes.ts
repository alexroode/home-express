import { Router, Request, Response } from 'express';
const router: Router = Router();

router.get('/', (req: Request, res: Response) => {
  res.render('index', { title: 'Home' });
});

router.get('/bio', (req: Request, res: Response) => {
  res.render('bio', { title: 'Bio' });
});

router.get('/contact', (req: Request, res: Response) => {
  res.render('contact', { title: 'Contact' });
});

export const HomeRoutes: Router = router;
