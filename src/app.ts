import express from 'express';
import cors from 'cors';
import { PostRouter } from './modules/post/post.router';
import { auth } from './lib/auth';
import { toNodeHandler } from "better-auth/node";
import { commentRouter } from './modules/comment/comment.router';

const app = express();
app.use(express.json());
app.use(cors({
    origin: process.env.APP_URL || 'http://localhost:5000',
    credentials: true,
}));


app.all("/api/auth/*splat", toNodeHandler(auth));


app.use('/posts', PostRouter);


app.use('/comments', commentRouter);


app.get('/', (req, res) => {
    res.send('postgresql + prisma server is running');
});


export default app;