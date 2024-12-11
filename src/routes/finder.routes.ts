import express from 'express';
import {
    getUsers,
    sendFriendRequest,
    acceptFriendRequest,
    getFriendRequests,
    rejectFriendRequest,
} from '../controllers/finder.controller';

const router = express.Router();

// Rutas de usuarios
router.post('/users', getUsers);

// Rutas de solicitudes de amistad
router.post('/friend-request/send', sendFriendRequest); // Enviar solicitud
router.post('/friend-request/accept', acceptFriendRequest); // Aceptar solicitud
router.post('/friend-request/reject', rejectFriendRequest); // Rechazar solicitud
router.post('/friend-requests', getFriendRequests); // Obtener solicitudes pendientes

export default router;
