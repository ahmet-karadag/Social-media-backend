
  import {Router} from "express";

  //controller içindeki modülü aldık.
  import * as authController from '../controllers/auth';
  //const authController = require('../controllers/auth');
  const router: Router = Router();
  router.post('/register', authController.register);
  router.post('/login',authController.login);

  export default router
  //module.exports = router;