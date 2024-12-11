import { Request, Response } from 'express';
import User from '../models/user';

// Obtener usuarios excluyendo amigos y solicitudes pendientes
export const getUsers = async (req: any, res: Response): Promise<Response | any> => {
    try {
        const { userId } = req.user;

        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: 'User not found' });

        const excludedIds = [...user.friends, ...user.friendRequests, userId];

        const users = await User.find({ _id: { $nin: excludedIds } }).select(
            'name lastName username'
        );

        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching users', error });
    }
};

// Enviar solicitud de amistad
export const sendFriendRequest = async (req: any, res: Response): Promise<Response | any> => {
    try {
        const { userId } = req.user;
        const { targetUserId } = req.body;

        if (userId === targetUserId) {
            return res.status(400).json({ message: 'Cannot send a request to yourself' });
        }

        const user = await User.findById(userId);
        const targetUser = await User.findById(targetUserId);

        if (!user || !targetUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (targetUser.friendRequests.includes(userId) || targetUser.friends.includes(userId)) {
            return res.status(400).json({ message: 'Request already sent or user already a friend' });
        }

        targetUser.friendRequests.push(userId);
        await targetUser.save();

        res.status(200).json({ message: 'Friend request sent successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error sending friend request', error });
    }
};

// Aceptar solicitud de amistad
export const acceptFriendRequest = async (req: any, res: Response): Promise<Response | any> => {
    try {
        const { userId } = req.user;
        const { requestUserId } = req.body;

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
