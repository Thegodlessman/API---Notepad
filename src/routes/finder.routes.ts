import express from 'express';
import {
    getUsers,
    sendFriendRequest,
    acceptFriendRequest,
} from '../controllers/finder.controller';

const router = express.Router();

// Rutas de usuarios
router.get('/users', getUsers);

// Rutas de solicitudes de amistad
router.post('/friend-request/send', sendFriendRequest);
router.post('/friend-request/accept', acceptFriendRequest);

export default router;
