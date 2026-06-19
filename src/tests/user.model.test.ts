
  import { describe,it,expect,beforeAll,afterAll,beforeEach } from 'vitest';
  import mongoose from 'mongoose';
  import User from '../model/user';

  describe('User model test', ()=>{

    beforeAll( async() => {
      const testDbUri = 'mongodb+srv://social:social1234@social.vzzxxgh.mongodb.net/social_media_test'; 
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