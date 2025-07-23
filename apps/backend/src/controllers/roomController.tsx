// apps/backend/src/controllers/roomController.ts
import { Request, Response } from 'express';
import { RoomService } from '../services/roomService';

interface AuthRequest extends Request {
  user?: any;
}

export class RoomController {
  static async createRoom(req: AuthRequest, res: Response) {
    try {
      const userId = req.user.id;
      const { name, description, maxParticipants, isPublic } = req.body;

      if (!name) {
        return res.status(400).json({
          success: false,
          message: 'Room name is required'
        });
      }

      const room = await RoomService.createRoom(userId, {
        name,
        description,
        maxParticipants: parseInt(maxParticipants) || 4,
        isPublic: Boolean(isPublic)
      });

      res.status(201).json({
        success: true,
        message: 'Room created successfully',
        data: room
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  static async joinRoom(req: AuthRequest, res: Response) {
    try {
      const userId = req.user.id;
      const { roomId } = req.params;

      const result = await RoomService.joinRoom(roomId, userId);

      res.json({
        success: true,
        message: result.message
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  static async leaveRoom(req: AuthRequest, res: Response) {
    try {
      const userId = req.user.id;
      const { roomId } = req.params;

      const result = await RoomService.leaveRoom(roomId, userId);

      res.json({
        success: true,
        message: result.message
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }
}
