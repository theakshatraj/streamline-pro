import { Router } from 'express';
import { RoomController } from '../controllers/roomController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// All room routes require authentication
router.use(authenticateToken);

// Room CRUD operations
router.post('/', RoomController.createRoom);
router.get('/', RoomController.getRooms);
router.get('/:roomId', RoomController.getRoom);
router.put('/:roomId', RoomController.updateRoom);
router.delete('/:roomId', RoomController.deleteRoom);

// Room participation
router.post('/:roomId/join', RoomController.joinRoom);
router.post('/:roomId/leave', RoomController.leaveRoom);

export default router; {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  static async getRooms(req: AuthRequest, res: Response) {
    try {
      const userId = req.user.id;
      const rooms = await RoomService.getRoomsByUser(userId);

      res.json({
        success: true,
        data: rooms
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  static async getRoom(req: AuthRequest, res: Response) {
    try {
      const userId = req.user.id;
      const { roomId } = req.params;

      const room = await RoomService.getRoomById(roomId, userId);

      res.json({
        success: true,
        data: room
      });
    } catch (error: any) {
      res.status(error.message === 'Room not found' ? 404 : 403).json({
        success: false,
        message: error.message
      });
    }
  }

  static async updateRoom(req: AuthRequest, res: Response) {
    try {
      const userId = req.user.id;
      const { roomId } = req.params;
      const updateData = req.body;

      const room = await RoomService.updateRoom(roomId, userId, updateData);

      res.json({
        success: true,
        message: 'Room updated successfully',
        data: room
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  static async deleteRoom(req: AuthRequest, res: Response) {
    try {
      const userId = req.user.id;
      const { roomId } = req.params;

      const result = await RoomService.deleteRoom(roomId, userId);

      res.json({
        success: true,
        message: result.message
      });
    } catch (error: any)