
  import { describe,it,expect,beforeAll,afterAll,beforeEach } from 'vitest';
  import mongoose from 'mongoose';
  import User from '../model/user';
  import dotenv from 'dotenv'; 

  dotenv.config();
  
  describe('User model test', ()=>{

    beforeAll( async() => {
      const testDbUri: string | undefined =  process.env.MONGO_URI!;
      await mongoose.connect(testDbUri); 
    });

    afterAll(async() => {
      await mongoose.connection.dropDatabase();//delete database
      await mongoose.disconnect();
    });

    beforeEach(async () => {
      await User.deleteMany(); 
    });

    it('registerUser fonk test',async() => {
      
      const fakeUser = {
        username: 'testuser',
        email: 'testuser@gmail.com',
        password: 'secretpassword123'    
      };

      const savedUser = await User.registerUser(fakeUser);
      
      expect(savedUser._id).toBeDefined();
      expect(savedUser.email).toBe(fakeUser.email);
      expect(savedUser.username).toBe(fakeUser.username);
      expect(savedUser.password).not.toBe(fakeUser.password);
    });  
  });