import { Router, Request, Response } from 'express';
const router: Router = Router();

router.get('/', function(req, res, next) {
  res.render('index', { title: 'Home' });
});

router.get('/bio', function(req, res, next) {
  res.render('bio', { title: 'Bio' });
});

router.get('/contact', function(req, res, next) {
  res.render('contact', { title: 'Contact' });
});

export const HomeRoutes: Router = router;
