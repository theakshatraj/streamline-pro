import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class RoomService {
  static async createRoom(userId: string, roomData: {
    name: string;
    description?: string;
    maxParticipants: number;
    isPublic: boolean;
  }) {
    const room = await prisma.room.create({
      data: {
        name: roomData.name,
        description: roomData.description,
        maxParticipants: roomData.maxParticipants,
        isPublic: roomData.isPublic,
        createdBy: userId,
        status: 'waiting',
      },
      include: {
        creator: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
          }
        },
        participants: {
          include: {
            user: {
              select: {
                id: true,
                username: true,
                firstName: true,
                lastName: true,
              }
            }
          }
        }
      }
    });

    return room;
  }

  static async getRoomsByUser(userId: string) {
    const rooms = await prisma.room.findMany({
      where: {
        OR: [
          { createdBy: userId },
          { participants: { some: { userId } } },
          { isPublic: true }
        ]
      },
      include: {
        creator: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
          }
        },
        participants: {
          include: {
            user: {
              select: {
                id: true,
                username: true,
                firstName: true,
                lastName: true,
              }
            }
          }
        },
        _count: {
          select: {
            participants: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return rooms.map(room => ({
      ...room,
      participants: room._count.participants
    }));
  }

  static async getRoomById(roomId: string, userId: string) {
    const room = await prisma.room.findUnique({
      where: { id: roomId },
      include: {
        creator: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
          }
        },
        participants: {
          include: {
            user: {
              select: {
                id: true,
                username: true,
                firstName: true,
                lastName: true,
              }
            }
          }
        }
      }
    });

    if (!room) {
      throw new Error('Room not found');
    }

    // Check if user has access to this room
    const hasAccess = room.createdBy === userId || 
                     room.participants.some(p => p.userId === userId) ||
                     room.isPublic;

    if (!hasAccess) {
      throw new Error('Access denied');
    }

    return room;
  }

  static async updateRoom(roomId: string, userId: string, updateData: {
    name?: string;
    description?: string;
    maxParticipants?: number;
    isPublic?: boolean;
  }) {
    // Check if user is the creator
    const room = await prisma.room.findUnique({
      where: { id: roomId }
    });

    if (!room) {
      throw new Error('Room not found');
    }

    if (room.createdBy !== userId) {
      throw new Error('Only room creator can update the room');
    }

    if (room.status === 'recording') {
      throw new Error('Cannot update room while recording is in progress');
    }

    const updatedRoom = await prisma.room.update({
      where: { id: roomId },
      data: updateData,
      include: {
        creator: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
          }
        },
        participants: {
          include: {
            user: {
              select: {
                id: true,
                username: true,
                firstName: true,
                lastName: true,
              }
            }
          }
        }
      }
    });

    return updatedRoom;
  }

  static async deleteRoom(roomId: string, userId: string) {
    // Check if user is the creator
    const room = await prisma.room.findUnique({
      where: { id: roomId }
    });

    if (!room) {
      throw new Error('Room not found');
    }

    if (room.createdBy !== userId) {
      throw new Error('Only room creator can delete the room');
    }

    if (room.status === 'recording') {
      throw new Error('Cannot delete room while recording is in progress');
    }

    await prisma.room.delete({
      where: { id: roomId }
    });

    return { message: 'Room deleted successfully' };
  }

  static async joinRoom(roomId: string, userId: string) {
    const room = await prisma.room.findUnique({
      where: { id: roomId },
      include: {
        participants: true
      }
    });

    if (!room) {
      throw new Error('Room not found');
    }

    if (room.participants.length >= room.maxParticipants) {
      throw new Error('Room is full');
    }

    // Check if user is already a participant
    const existingParticipant = await prisma.roomParticipant.findUnique({
      where: {
        roomId_userId: {
          roomId,
          userId
        }
      }
    });

    if (existingParticipant) {
      throw new Error('User is already a participant');
    }

    // Add user as participant
    await prisma.roomParticipant.create({
      data: {
        roomId,
        userId,
        joinedAt: new Date(),
      }
    });

    return { message: 'Successfully joined the room' };
  }

  static async leaveRoom(roomId: string, userId: string) {
    const participant = await prisma.roomParticipant.findUnique({
      where: {
        roomId_userId: {
          roomId,
          userId
        }
      }
    });

    if (!participant) {
      throw new Error('User is not a participant in this room');
    }

    await prisma.roomParticipant.delete({
      where: {
        roomId_userId: {
          roomId,
          userId
        }
      }
    });

    return { message: 'Successfully left the room' };
  }

  static async updateRoomStatus(roomId: string, status: 'waiting' | 'recording' | 'completed') {
    const room = await prisma.room.update({
      where: { id: roomId },
      data: { 
        status,
        updatedAt: new Date()
      }
    });

    return room;
  }
}