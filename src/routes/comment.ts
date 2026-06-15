  import { Router } from 'express';

  const router:Router = Router();

  import authMiddleware from '../middleware/auth';
  import *as commentController from '../controllers/comment' //*as hepsini tek obje altında tutmak için,tek tek export ettiğim için

  router.post('/create',authMiddleware, commentController.createComment);
  router.get('/:postId',authMiddleware,commentController.getCommentsByPost);

  export default router;