  import multer, { Multer } from 'multer';
  import { FileFilterCallback } from 'multer';
  import { Request } from 'express';
  const storage = multer.memoryStorage();

  const fileFilter = (req: Request, file: Express.Multer.File, cb: FileFilterCallback):void =>{
    if(file.mimetype.startsWith('image/')){
      cb(null, true);    
    }else{
       cb(null, false);   
    }
  };

  export const upload = multer({
    storage: storage,
    limits: {fileSize: 5 * 1024 * 1024},
    fileFilter: fileFilter  
  })
