import express, {Request, Response, Express, NextFunction} from 'express';

import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import morgan from "morgan"
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';



// Import Routes
import userRoutes from './routes/users';
import authRoutes from './routes/auth';
import artworksRoutes from './routes/artworks';

dotenv.config({ path: './.env' });

const app: Express = express();

// set up rate limit with express-rate-limit
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes in milliseconds
    max: 100, // Limit each IP to 100 requests per windowMs
    handler: (req, res) => {
      res.status(429).json({
        error: 'Too many requests, please try again later.',
      });
    },
  });

app.use(limiter);

app.use(helmet());

// logs http actions to the terminal
app.use(morgan('dev'));
app.use(cookieParser());

app.use(cors({
    origin: [
       process.env.CORS_ORIGINS || '',
    ],
    credentials: true,
}));

app.use(express.json());

// Routes
app.get('/', (req: Request, res: Response) => {
    res.send("Express + TypeScript Server");
}   );

// Users 
app.use('/api/users', userRoutes);

// Artworks
app.use('/api/artworks', artworksRoutes);

// Auth
app.use('/api/auth', authRoutes);

// Global error handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error('Error:', err.message);
    res.status(500).json({ message: 'Internal Server Error', error: err.message });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

