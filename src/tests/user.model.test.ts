
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

    it('registerUser function test',async() => {
      
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
    
    it('is there user', async() => {
      const existingUser = {
        username: 'uniqueuser',
        email: 'unique@gmail.com',
        password: 'password123'
      }
      
      const savedUser = await User.registerUser(existingUser);
      const foundUser = await User.findOne({email: existingUser.email});

      expect(foundUser).not.toBe(null);
      expect(foundUser?.username).toBe(existingUser.username);
    });
    //for same email. 
    it('if same email registered again, return error', async() => {
      const firstUser = {
        username: 'user1',
        email: 'sameemail@gmail.com',
        password: 'password123'
      };

      const secondUser = {
        username: 'user2',
        email: 'sameemail@gmail.com', // Email same
        password: 'differentpassword'
      };
      
      await User.registerUser(firstUser);

      await expect(User.registerUser(secondUser))
        .rejects
        .toThrow('this email is already registered');
    });
  //for same username
    it('username not to be same', async() => {
      const firstUser = {
        username: 'sameusername',
        email: 'user1@gmail.com',
        password: 'password123'
      };

      const secondUser = {
        username: 'sameusername', // username is same with first user.
        email: 'user2@gmail.com',
        password: 'differentpassword'
      };
      await User.registerUser(firstUser);

      await expect(User.registerUser(secondUser))
        .rejects
        .toThrow('this username is alraedy taken');
    });
    //login 
    it('user can login with real email and password', async() =>{
      
      const rawPassword = 'password1234' 

      const fakeUser = {
        username: 'loginuser',
        email: 'login@gmail.com',
        password: rawPassword // raw password
      };

      const savedUser = await User.registerUser(fakeUser);
      
      const loggedInUser = await User.findByCredentials({
        email: savedUser.email,
        password: rawPassword  
      });

      expect(loggedInUser).toBeDefined();
      expect(loggedInUser.email).toBe(savedUser.email);
      expect(loggedInUser.username).toBe(savedUser.username);

    })
  });