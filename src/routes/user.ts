
  import {Router,Request,Response} from 'express';
  import User from '../model/user';

  const router: Router = Router();
  import authMiddleware from '../middleware/auth';
  import { getProfile } from '../controllers/user';
  //const authMiddleware = require('../middleware/auth');


  //proteched route' muz
  router.get('/me', authMiddleware, getProfile);
  
  export default router;
  //module.exports = router;