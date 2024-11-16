import express, {Request, Response, Express, NextFunction} from 'express';
import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';


// Import Routes
import userRoutes from './routes/users';
import authRoutes from './routes/auth';
import artworksRoutes from './routes/artworks';



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

app.use(cors({
    origin: [
        'http://localhost:5173',           // Local development
        'https://full-stack-trail.vercel.app' // Deployed Vercel URL
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

