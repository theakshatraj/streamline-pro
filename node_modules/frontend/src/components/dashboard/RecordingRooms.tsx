// apps/frontend/src/components/dashboard/RecordingRooms.tsx
import React, { useState, useEffect } from 'react';
import { 
  PlusIcon, 
  MicrophoneIcon, 
  VideoCameraIcon,
  ClockIcon,
  UserGroupIcon,
  TrashIcon,
  PencilIcon,
  PlayIcon,
  StopIcon
} from '@heroicons/react/24/outline';
import { useAuthStore } from '../../store/authStore';
//import { roomAPI } from '../../services/api';
import toast from 'react-hot-toast';

interface RecordingRoom {
  id: string;
  name: string;
  description?: string;
  createdBy: string;
  participants: number;
  maxParticipants: number;
  status: 'waiting' | 'recording' | 'completed';
  createdAt: string;
  updatedAt: string;
  recordingDuration?: number;
  isPublic: boolean;
}

export const RecordingRooms: React.FC = () => {
  const [rooms, setRooms] = useState<RecordingRoom[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<RecordingRoom | null>(null);
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      setIsLoading(true);
      const response = await roomAPI.getRooms();
      
      if (response.success) {
        setRooms(response.data);
      } else {
        toast.error(response.message || 'Failed to fetch rooms');
      }
    } catch (error) {
      toast.error('Failed to load recording rooms');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateRoom = async (roomData: Partial<RecordingRoom>) => {
    try {
      const response = await roomAPI.createRoom(roomData);
      
      if (response.success) {
        toast.success('Recording room created successfully!');
        setRooms(prev => [response.data, ...prev]);
        setShowCreateModal(false);
      } else {
        toast.error(response.message || 'Failed to create room');
      }
    } catch (error) {
      toast.error('Failed to create recording room');
    }
  };

  const handleDeleteRoom = async (roomId: string) => {
    if (!confirm('Are you sure you want to delete this recording room?')) {
      return;
    }

    try {
      const response = await roomAPI.deleteRoom(roomId);
      
      if (response.success) {
        toast.success('Room deleted successfully');
        setRooms(prev => prev.filter(room => room.id !== roomId));
      } else {
        toast.error(response.message || 'Failed to delete room');
      }
    } catch (error) {
      toast.error('Failed to delete room');
    }
  };

  const handleJoinRoom = (roomId: string) => {
    // This will be implemented in Phase 2 with WebRTC
    toast.info('Room joining will be available in the next update!');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'waiting': return 'bg-yellow-100 text-yellow-800';
      case 'recording': return 'bg-red-100 text-red-800';
      case 'completed': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'waiting': return <ClockIcon className="w-4 h-4" />;
      case 'recording': return <MicrophoneIcon className="w-4 h-4 text-red-500" />;
      case 'completed': return <StopIcon className="w-4 h-4" />;
      default: return <ClockIcon className="w-4 h-4" />;
    }
  };

  const formatDuration = (seconds?: number) => {
    if (!seconds) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">Loading recording rooms...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Recording Rooms</h1>
          <p className="text-gray-600 mt-1">
            Create and manage your podcast recording sessions
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-700 transition-colors"
        >
          <PlusIcon className="w-5 h-5" />
          <span>Create Room</span>
        </button>
      </div>

      {/* Rooms Grid */}
      {rooms.length === 0 ? (
        <div className="text-center py-12">
          <MicrophoneIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No recording rooms yet</h3>
          <p className="text-gray-600 mb-6">Create your first recording room to get started</p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Create Your First Room
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rooms.map((room) => (
            <div key={room.id} className="bg-white rounded-lg shadow-md border hover:shadow-lg transition-shadow">
              <div className="p-6">
                {/* Room Header */}
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      {room.name}
                    </h3>
                    {room.description && (
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {room.description}
                      </p>
                    )}
                  </div>
                  
                  {/* Status Badge */}
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(room.status)}`}>
                    {getStatusIcon(room.status)}
                    <span className="ml-1 capitalize">{room.status}</span>
                  </span>
                </div>

                {/* Room Info */}
                <div className="space-y-3 mb-6">
                  <div className="flex items-center text-sm text-gray-600">
                    <UserGroupIcon className="w-4 h-4 mr-2" />
                    <span>{room.participants}/{room.maxParticipants} participants</span>
                  </div>
                  
                  {room.recordingDuration && (
                    <div className="flex items-center text-sm text-gray-600">
                      <ClockIcon className="w-4 h-4 mr-2" />
                      <span>Duration: {formatDuration(room.recordingDuration)}</span>
                    </div>
                  )}
                  
                  <div className="flex items-center text-sm text-gray-600">
                    <span>Created: {new Date(room.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex space-x-2">
                  {room.status === 'waiting' && (
                    <button
                      onClick={() => handleJoinRoom(room.id)}
                      className="flex-1 bg-blue-600 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors flex items-center justify-center"
                    >
                      <PlayIcon className="w-4 h-4 mr-1" />
                      Join
                    </button>
                  )}
                  
                  {room.status === 'recording' && (
                    <button
                      onClick={() => handleJoinRoom(room.id)}
                      className="flex-1 bg-red-600 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-red-700 transition-colors flex items-center justify-center"
                    >
                      <MicrophoneIcon className="w-4 h-4 mr-1" />
                      Rejoin
                    </button>
                  )}

                  {room.createdBy === user?.id && room.status !== 'recording' && (
                    <>
                      <button
                        onClick={() => setSelectedRoom(room)}
                        className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                        title="Edit room"
                      >
                        <PencilIcon className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteRoom(room.id)}
                        className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                        title="Delete room"
                      >
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Room Modal */}
      {showCreateModal && (
        <CreateRoomModal
          onClose={() => setShowCreateModal(false)}
          onSubmit={handleCreateRoom}
        />
      )}

      {/* Edit Room Modal */}
      {selectedRoom && (
        <EditRoomModal
          room={selectedRoom}
          onClose={() => setSelectedRoom(null)}
          onSubmit={(updatedRoom) => {
            setRooms(prev => prev.map(room => 
              room.id === selectedRoom.id ? { ...room, ...updatedRoom } : room
            ));
            setSelectedRoom(null);
          }}
        />
      )}
    </div>
  );
};

// Create Room Modal Component
interface CreateRoomModalProps {
  onClose: () => void;
  onSubmit: (roomData: Partial<RecordingRoom>) => void;
}

const CreateRoomModal: React.FC<CreateRoomModalProps> = ({ onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    maxParticipants: 4,
    isPublic: false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <h2 className="text-xl font-bold mb-4">Create Recording Room</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Room Name *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="My Podcast Recording"
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Brief description of the recording session..."
            />
          </div>

          <div>
            <label htmlFor="maxParticipants" className="block text-sm font-medium text-gray-700 mb-1">
              Max Participants
            </label>
            <select
              id="maxParticipants"
              name="maxParticipants"
              value={formData.maxParticipants}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value={2}>2 participants</option>
              <option value={3}>3 participants</option>
              <option value={4}>4 participants</option>
              <option value={6}>6 participants</option>
            </select>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="isPublic"
              name="isPublic"
              checked={formData.isPublic}
              onChange={handleChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="isPublic" className="ml-2 block text-sm text-gray-700">
              Make room publicly discoverable
            </label>
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Create Room
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Edit Room Modal Component
interface EditRoomModalProps {
  room: RecordingRoom;
  onClose: () => void;
  onSubmit: (roomData: Partial<RecordingRoom>) => void;
}

const EditRoomModal: React.FC<EditRoomModalProps> = ({ room, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: room.name,
    description: room.description || '',
    maxParticipants: room.maxParticipants,
    isPublic: room.isPublic,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <h2 className="text-xl font-bold mb-4">Edit Recording Room</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Room Name *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="maxParticipants" className="block text-sm font-medium text-gray-700 mb-1">
              Max Participants
            </label>
            <select
              id="maxParticipants"
              name="maxParticipants"
              value={formData.maxParticipants}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value={2}>2 participants</option>
              <option value={3}>3 participants</option>
              <option value={4}>4 participants</option>
              <option value={6}>6 participants</option>
            </select>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="isPublic"
              name="isPublic"
              checked={formData.isPublic}
              onChange={handleChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="isPublic" className="ml-2 block text-sm text-gray-700">
              Make room publicly discoverable
            </label>
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Update Room
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};