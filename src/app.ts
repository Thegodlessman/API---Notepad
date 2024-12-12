import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import passport from 'passport';
import passportMiddleware from './middlewares/passport';

import authRoutes from './routes/auth.routes';
import specialRoutes from './routes/special.routes';
import movieRoutes from './routes/movie.routes';
import imageRoute from './routes/image.routes';
import finderRoutes from './routes/finder.routes';
import chatRoutes from './routes/chat.routes';

import dotenv from 'dotenv';
dotenv.config();

const app = express();

// Configuración del puerto
app.set('port', process.env.PORT || 5757);

// Middleware
app.use(morgan('dev'));
app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(passport.initialize());
passport.use(passportMiddleware);

// Rutas
app.use(authRoutes);
app.use(specialRoutes);
app.use(movieRoutes);
app.use(imageRoute);
app.use(finderRoutes);
app.use(chatRoutes);

export default app;
