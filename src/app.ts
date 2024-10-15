import express from 'express';
import morgan from 'morgan';
import cors from 'cors'

import authRoutes from './routes/auth.routes'

const app = express();

app.set('port', process.env.PORT || 5757);

app.use(morgan('dev'));
app.use(cors())
app.use(express.urlencoded({extended: false}));
app.use(express.json());

app.get('/', (req, res) => {
    res.send(`La API está en:${app.get('port')}`)
}); 

app.use(authRoutes);

export default app;