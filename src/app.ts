// const express = require('express');
// const dotenv = require('dotenv');
// const connectDB = require('./src/config/db');

import express,{ Application} from 'express';
import dotenv from 'dotenv'
import connectDB from './config/db';

import authRoutes from './routes/auth';
import userRoutes from './routes/user';
import messageRoutes from './routes/message';
import postRoutes from './routes/post';
import commentRoutes from './routes/comment';

dotenv.config();
connectDB();
const app: Application = express();

app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/posts',postRoutes);
app.use('/api/comments',commentRoutes);
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

export default app; 
//module.exports = app;
