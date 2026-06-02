
import {Router,Request,Response} from 'express';


const router: Router = Router();
import authMiddleware from '../middleware/auth';
//const authMiddleware = require('../middleware/auth');


//proteched route' muz
router.get('/me', authMiddleware, (req:Request, res: Response): void => {
   
    
    res.status(200).json({
        success: true,
        user: (req as any).user
    });
});
export default router;
//module.exports = router;