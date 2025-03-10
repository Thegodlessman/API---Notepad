import { Request, Response } from 'express';
import User from '../models/user';

export const getUsers = async (req: Request, res: Response): Promise<Response | any> => {
    try {
        const { userId } = req.body; // Suponiendo que el `userId` se pasa en el cuerpo de la solicitud

        if (!userId) {
            return res.status(400).json({ message: 'User ID is required' });
        }

        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: 'User not found' });

        const excludedIds = [...user.friends, ...user.friendRequests, userId];

        const users = await User.find({ _id: { $nin: excludedIds } }).select(
            'name lastName username profileImage'
        );

        return res.status(200).json(users);
    } catch (error) {
        return res.status(500).json({ message: 'Error fetching users', error });
    }
};


// Enviar solicitud de amistad
export const sendFriendRequest = async (req: Request, res: Response): Promise<Response | any> => {
    try {
        const { targetUserId, userId } = req.body;

        if (!targetUserId || !userId) {
            return res.status(400).json({ message: 'Faltan datos requeridos' });
        }

        // Verifica si el usuario destino existe
        const targetUser = await User.findById(targetUserId);
        if (!targetUser) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        // Verifica si ya existe una solicitud de amistad o son amigos
        if (targetUser.friends.includes(userId)) {
            return res.status(400).json({ message: 'Ya son amigos' });
        }

        if (targetUser.friendRequests.includes(userId)) {
            return res.status(400).json({ message: 'Solicitud ya enviada' });
        }

        // Agrega la solicitud de amistad al usuario destino
        targetUser.friendRequests.push(userId);
        await targetUser.save();

        return res.status(200).json({ message: 'Solicitud de amistad enviada' });
    } catch (error) {
        console.error('Error en sendFriendRequest:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};

// Aceptar solicitud de amistad
export const acceptFriendRequest = async (req: any, res: Response): Promise<Response | any> => {
    try {
        const { requestUserId, userId } = req.body;

        const user = await User.findById(userId);
        const requestUser = await User.findById(requestUserId);

        if (!user || !requestUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (!user.friendRequests.includes(requestUserId)) {
            return res.status(400).json({ message: 'No friend request found' });
        }

        user.friendRequests = user.friendRequests.filter((id) => id.toString() !== requestUserId);
        user.friends.push(requestUserId);

        requestUser.friends.push(userId);

        await user.save();
        await requestUser.save();

        res.status(200).json({ message: 'Friend request accepted' });
    } catch (error) {
        res.status(500).json({ message: 'Error accepting friend request', error });
    }
};

export const getFriendRequests = async (req: Request, res: Response): Promise<Response | any> => {
    try {
        const { userId } = req.body;

        if (!userId) {
            return res.status(400).json({ message: 'User ID is required' });
        }

        const user = await User.findById(userId).populate('friendRequests', 'name lastName username profileImage');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        return res.status(200).json(user.friendRequests);
    } catch (error) {
        return res.status(500).json({ message: 'Error fetching friend requests', error });
    }
};

export const rejectFriendRequest = async (req: Request, res: Response): Promise<Response | any> => {
    try {
        const { requestUserId, userId } = req.body;

        if (!requestUserId || !userId) {
            return res.status(400).json({ message: 'Faltan datos requeridos' });
        }

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (!user.friendRequests.includes(requestUserId)) {
            return res.status(400).json({ message: 'No friend request found' });
        }

        user.friendRequests = user.friendRequests.filter((id) => id.toString() !== requestUserId);
        await user.save();

        return res.status(200).json({ message: 'Friend request rejected' });
    } catch (error) {
        return res.status(500).json({ message: 'Error rejecting friend request', error });
    }
};
