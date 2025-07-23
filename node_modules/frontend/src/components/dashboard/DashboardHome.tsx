// apps/frontend/src/components/dashboard/DashboardHome.tsx
import React from 'react';
import { useAuthStore } from '../../store/authStore';
import { Plus, Radio, FolderOpen, Clock, Users, Mic } from 'lucide-react';

type DashboardView = 'home' | 'rooms' | 'recordings' | 'settings';

interface DashboardHomeProps {
  onNavigate: (view: DashboardView) => void;
}

export const DashboardHome: React.FC<DashboardHomeProps> = ({ onNavigate }) => {
  const user = useAuthStore((state) => state.user);

  // Mock data - in real app, this would come from API
  const stats = {
    totalRecordings: 12,
    totalHours: 36.5,
    activeRooms: 2,
    recentRecordings: [
      {
        id: 1,
        title: 'Tech Talk Episode 15',
        date: '2025-06-24',
        duration: '1h 23m',
        participants: 3,
      },
      {
        id: 2,
        title: 'Interview with Sarah Johnson',
        date: '2025-06-22',
        duration: '45m',
        participants: 2,
      },
      {
        id: 3,
        title: 'Product Review Session',
        date: '2025-06-20',
        duration: '2h 10m',
        participants: 4,
      },
    ],
  };

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">
          Welcome back, {user?.firstName}!
        </h1>
        <p className="text-blue-100 mb-4">
          Ready to create your next amazing podcast? Let's get started.
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => onNavigate('rooms')}
            className="flex items-center justify-center bg-white text-blue-600 px-6 py-3 rounded-lg font-medium hover:bg-blue-50 transition-colors"
          >
            <Plus className="mr-2 h-5 w-5" />
            New Recording Room
          </button>
          <button
            onClick={() => onNavigate('recordings')}
            className="flex items-center justify-center border border-blue-300 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            <FolderOpen className="mr-2 h-5 w-5" />
            View Recordings
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100">
              <FolderOpen className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Recordings</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalRecordings}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100">
              <Clock className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Hours Recorded</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalHours}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100">
              <Radio className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active Rooms</p>
              <p className="text-2xl font-bold text-gray-900">{stats.activeRooms}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Quick Actions</h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <button
              onClick={() => onNavigate('rooms')}
              className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors"
            >
              <div className="p-2 bg-blue-100 rounded-lg">
                <Mic className="h-5 w-5 text-blue-600" />
              </div>
              <div className="ml-4 text-left">
                <p className="font-medium text-gray-900">Start Recording</p>
                <p className="text-sm text-gray-500">Create a new recording room</p>
              </div>
            </button>

            <button
              onClick={() => onNavigate('rooms')}
              className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-green-300 hover:bg-green-50 transition-colors"
            >
              <div className="p-2 bg-green-100 rounded-lg">
                <Users className="h-5 w-5 text-green-600" />
              </div>
              <div className="ml-4 text-left">
                <p className="font-medium text-gray-900">Join Room</p>
                <p className="text-sm text-gray-500">Enter a room code to join</p>
              </div>
            </button>

            <button
              onClick={() => onNavigate('recordings')}
              className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition-colors"
            >
              <div className="p-2 bg-purple-100 rounded-lg">
                <FolderOpen className="h-5 w-5 text-purple-600" />
              </div>
              <div className="ml-4 text-left">
                <p className="font-medium text-gray-900">Browse Library</p>
                <p className="text-sm text-gray-500">View all recordings</p>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Recent Recordings */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-lg font-medium text-gray-900">Recent Recordings</h2>
          <button
            onClick={() => onNavigate('recordings')}
            className="text-sm text-blue-600 hover:text-blue-800 font-medium"
          >
            View all
          </button>
        </div>
        <div className="p-6">
          {stats.recentRecordings.length === 0 ? (
            <div className="text-center py-8">
              <FolderOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 mb-2">No recordings yet</p>
              <p className="text-sm text-gray-400">
                Create your first recording room to get started
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {stats.recentRecordings.map((recording) => (
                <div
                  key={recording.id}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
                >
                  <div className="flex items-center">
                    <div className="p-2 bg-gray-100 rounded-lg">
                      <Mic className="h-5 w-5 text-gray-600" />
                    </div>
                    <div className="ml-4">
                      <p className="font-medium text-gray-900">{recording.title}</p>
                      <p className="text-sm text-gray-500">
                        {recording.date} • {recording.duration} • {recording.participants} participants
                      </p>
                    </div>
                  </div>
                  <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                    View
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};