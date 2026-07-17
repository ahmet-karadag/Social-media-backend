
  import { describe, it, expect, beforeAll, afterAll,beforeEach  } from 'vitest';
  import mongoose from 'mongoose';
  import supertest from 'supertest';
  import User from '../model/user';
  import app from '../app';
  import dotenv from 'dotenv';
import { register } from 'node:module';

  dotenv.config();

  const request = supertest(app);
  
  describe('auth api tests', () => {
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
    
    it('should register a new user', async() =>{
      const userData = {
        username: 'testuser',
        email: 'test@gmail.com',
        password: 'password123'  
      }   

      const res = await request
        .post('/api/auth/register')
        .send(userData)

        expect(res.status).toBe(201);
        expect(res.body).toHaveProperty('message', 'user registered succesfully');
        expect(res.body).toHaveProperty('token');
        expect(res.body.user).toHaveProperty('username', 'testuser');
        expect(res.body.user).toHaveProperty('email', 'test@gmail.com');
        expect(res.body.user).not.toHaveProperty('password');

        const userInDb = await User.findOne({email: 'test@gmail.com'});
        
        expect(userInDb).toBeTruthy();
        expect(userInDb?.username).toBe('testuser');
    });
    //we only send email, username and password are missing  
    it('could not register a user with missing fields', async() => {
      const incompleteUser = {
        email: 'missing@gmail.com'
      }

      const res = await request
        .post('/api/auth/register')
        .send(incompleteUser)
      
      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('message','username, email and password are required');  
    });
  });

  