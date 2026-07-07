
  import { Router } from 'express';
  const router:Router = Router();

  import { toggleLike } from '../controllers/likes';
  import  authMiddleware from '../middleware/auth';
  
  router.post('/:postId/toggle-like',authMiddleware,toggleLike);

  export default router;
