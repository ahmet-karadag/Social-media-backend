
import {IUserDocument} from '../model/user';
//IUserDocument kullanma sebebim veri + metodlar almak.
declare global {
    namespace express {
        interface Request {
            user?:IUserDocument;
        }
    }
}