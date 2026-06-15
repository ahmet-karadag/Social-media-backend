  import { Request } from 'express';
  import {IUserDocument} from '../model/user';
  //IUserDocument kullanma sebebim veri + metodlar almak.

  declare global {
    namespace Express {
      interface Request {
        user?:IUserDocument;
      }
    }
  };