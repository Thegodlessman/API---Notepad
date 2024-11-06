import express from 'express';
import morgan from 'morgan';
import cors from 'cors'
import passport from 'passport';
import passportMiddleware from './middlewares/passport';

import authRoutes from './routes/auth.routes'
import specialRoutes from './routes/special.routes'
import movieRoutes from './routes/movie.routes'

import dotenv from 'dotenv';
dotenv.config();


const app = express();

app.set('port', process.env.PORT || 5757);

app.use(morgan('dev'));
app.use(cors())
app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(passport.initialize())
passport.use(passportMiddleware)

app.get('/', (req, res) => {
    res.send(`La API está en:${app.get('port')}`)
}); 

app.use(authRoutes);
app.use(specialRoutes);
app.use(movieRoutes)

export default app;