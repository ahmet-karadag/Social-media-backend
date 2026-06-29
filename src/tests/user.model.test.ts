
  import { describe,it,expect,beforeAll,afterAll,beforeEach } from 'vitest';
  import mongoose from 'mongoose';
  import User from '../model/user';
  import dotenv from 'dotenv'; 
  import Jwt  from 'jsonwebtoken';

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
    //register user test 
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
    
    //is there user
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

    });
    
    //wrong mail 
    it('login with wrong mail', async() => {
      
      const fakeUser = {
        username: 'wronguser',
        email: 'wrongmail@gmail.com',
        password: 'wrongpassword'  
      };
      
      const savedUser = await User.registerUser(fakeUser);
      
      await expect(User.findByCredentials({ email: 'thiswrong@gmail.com', password: savedUser.password }))
        .rejects
        .toThrow('Invalid credentials');
    });

    //wrong password
    it('login with wrong password', async() => {
      
      const fakeUser = {
        username: 'wronguser',
        email: 'wrongmail@gmail.com',
        password: 'wrongpassword'  
      };
      
      const savedUser = await User.registerUser(fakeUser);
      
      await expect(User.findByCredentials({ email: savedUser.email, password: 'thisiswrongpassword' }))
        .rejects
        .toThrow('invalid password');
    });

    //token test
    it('token can be valid', async() =>{

      const fakeUser = {
        username: 'tokenuser',
        email: 'token@gmail.com',
        password: 'password123'
      };
    
      const savedUser = await User.registerUser(fakeUser);
      const token = savedUser.generateAuthToken();
      
      expect(token).toBeDefined();
      expect(typeof token).toBe('string');

      const decoded = Jwt.verify(token, process.env.JWT_SECRET!) as {id: string, username: string};

      expect(decoded.id).toBe(savedUser._id.toString());
      expect(decoded.username).toBe(savedUser.username);
    });

    // Test that the toJSON method hides the password field
    it('should hide password field', async () => {
      const fakeUser = {
        username: 'jsonuser',
        email: 'json@gmail.com',
        password: 'password123'
      };

      const savedUser = await User.registerUser(fakeUser);
      const userJson = savedUser.toJSON();

      expect(userJson.password).toBeUndefined();
      expect(userJson.email).toBe(savedUser.email);
      expect(userJson.username).toBe(savedUser.username);
    });

    //if username is less than 4 characters --- error
    it('if username is less than 4 characters', async() =>{
      const shortUser = {
        username: 'asd',
        email: 'short@gmail.com',
        password: 'password123'
      };

      await expect(User.registerUser(shortUser))
        .rejects
        .toThrow();
    });

    //if username has more than 15 characters -- error 
    it('if username has 15 characters', async() =>{
      const longUser = {
        username: 'a' .repeat(16),
        email: 'long@gmail.com',
        password: 'password123'
      };
      
      await expect(User.registerUser(longUser))
        .rejects
        .toThrow();
    });
    
    //if username contains special characters--error
    it('if username contains special characters', async() =>{
      const specialCharUser = {
        username: 'a_bcs',
        email: 'special@gmail.com',
        password: 'password123'
      };
      
      await expect(User.registerUser(specialCharUser))
        .rejects
        .toThrow();
    });

    //if email format is invalid-- email validation tests
    it('if email format is invalid',async() => {
      const invalidEmail = {
        username: 'validuser',
        email: 'invald-emailadress',
        password: 'password123'
      };

      await expect(User.registerUser(invalidEmail))
        .rejects
        .toThrow();
    });
    
    //password validation test
    it('if password is less than 6 characters',async() => {
      const invalidPassword = {
        username: 'validuser',
        email: 'valid@gmail.com',
        password: '1234'
      };

      await expect(User.registerUser(invalidPassword))
        .rejects
        .toThrow();
    });
    
    // when username change but password didnt change.
    it('when shouldnt re-hash the password if it is not modified', async() => {
      const fakeUser = {
        username: 'modifyuser',
        email: 'modify@gmail.com',
        password: 'password123'
      };

      const savedUser = await User.registerUser(fakeUser);
      const firstHash = savedUser.password;

      savedUser.username = 'updateusername';

      const updatedUser = await savedUser.save();

      expect(updatedUser.password).toBe(firstHash);

    });
  });