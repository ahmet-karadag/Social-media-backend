
  import {Router,Request,Response} from 'express';
  import User from '../model/user';

  const router: Router = Router();
  import authMiddleware from '../middleware/auth';
  //const authMiddleware = require('../middleware/auth');


  //proteched route' muz
  router.get('/me', authMiddleware, async(req:Request, res: Response) => {
     
   try {
     const userId = req.user?._id;

     if (!userId) {
       res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const user = await User.getUserProfile({ userId: userId.toString() });

    res.status(200).json({
      success: true,
      user 
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Profil coldnt get';
    res.status(400).json({ success: false, message: errorMessage }); 
  }
  });
  
  export default router;
  //module.exports = router;