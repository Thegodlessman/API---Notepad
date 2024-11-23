import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import passport from 'passport';
import passportMiddleware from './middlewares/passport';

import authRoutes from './routes/auth.routes';
import specialRoutes from './routes/special.routes';
import movieRoutes from './routes/movie.routes';
import dotenv from 'dotenv';
dotenv.config();

const app = express();

// Configuración del puerto
app.set('port', process.env.PORT || 5757);

// Middleware de log
app.use(morgan('dev'));

// Configuración de CORS
app.use(cors({
    origin: '*', // Reemplaza con la URL de tu frontend
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Métodos permitidos
    allowedHeaders: ['Content-Type', 'Authorization'], // Encabezados permitidos
    optionsSuccessStatus: 204, // Código de éxito para OPTIONS
}));

// Respuesta manual para preflight requests (OPTIONS) en rutas específicas
app.options('*', (req, res) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.sendStatus(204);
});

// Configuración de middlewares adicionales
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(passport.initialize());
passport.use(passportMiddleware);

// Rutas
app.get('/', (req, res) => {
    res.send(`La API está en: ${app.get('port')}`);
});

app.use(authRoutes);
app.use(specialRoutes);
app.use(movieRoutes);

export default app;
