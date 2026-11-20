
  import {Router,Request,Response} from 'express';
  import User from '../model/user';
   
  
  import authMiddleware from '../middleware/auth';
  import upload from '../middleware/upload';
  import { getProfile,uploadProfilePicture } from '../controllers/user';
  //const authMiddleware = require('../middleware/auth');
  const router: Router = Router();

  //proteched route' muz
  router.get('/me', authMiddleware, getProfile);
  
  router.post(
    '/profile-picture',
    authMiddleware,
    upload.single('image'), // Swift tarafındaki fieldName ("image") ile aynı olmalı
    uploadProfilePicture
  );
  export default router;
  //module.exports = router;