import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.routes.js';
import counterRoutes from './routes/counter.routes.js';



const app = express();
app.use(cors({origin: true, credentials: true}));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/counter', counterRoutes);

export default app;