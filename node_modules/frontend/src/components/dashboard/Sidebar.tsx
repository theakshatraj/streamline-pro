// apps/frontend/src/components/dashboard/Sidebar.tsx
import React from 'react';
import { Home, Radio, FolderOpen, Settings, X } from 'lucide-react';

type DashboardView = 'home' | 'rooms' | 'recordings' | 'settings';

interface SidebarProps {
  currentView: DashboardView;
  onViewChange: (view: DashboardView) => void;
  isOpen: boolean;
  onClose: () => void;
}

const navigationItems = [
  {
    id: 'home' as DashboardView,
    name: 'Dashboard',
    icon: Home,
    description: 'Overview and quick actions',
  },
  {
    id: 'rooms' as DashboardView,
    name: 'Recording Rooms',
    icon: Radio,
    description: 'Create and join recording sessions',
  },
  {
    id: 'recordings' as DashboardView,
    name: 'My Recordings',
    icon: FolderOpen,
    description: 'Manage your recorded content',
  },
  {
    id: 'settings' as DashboardView,
    name: 'Settings',
    icon: Settings,
    description: 'Account and recording preferences',
  },
];

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  onViewChange,
  isOpen,
  onClose,
}) => {
  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 lg:hidden"
          onClick={onClose}
        >
          <div className="fixed inset-0 bg-gray-600 bg-opacity-75" />
        </div>
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}
      >
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200 lg:hidden">
          <span className="text-lg font-semibold text-gray-900">Menu</span>
          <button
            type="button"
            className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
            onClick={onClose}
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <nav className="mt-8 px-4">
          <ul className="space-y-2">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;

              return (
                <li key={item.id}>
                  <button
                    onClick={() => {
                      onViewChange(item.id);
                      onClose(); // Close mobile sidebar
                    }}
                    className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                      isActive
                        ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                        : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <Icon
                      className={`mr-3 h-5 w-5 ${
                        isActive ? 'text-blue-700' : 'text-gray-400'
                      }`}
                    />
                    <div className="text-left">
                      <div className="font-medium">{item.name}</div>
                      <div className="text-xs text-gray-500 mt-0.5">
                        {item.description}
                      </div>
                    </div>
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Bottom section */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <div className="bg-blue-50 rounded-lg p-4">
            <h3 className="text-sm font-medium text-blue-900 mb-1">
              Ready to record?
            </h3>
            <p className="text-xs text-blue-700 mb-3">
              Create a new recording room and invite guests.
            </p>
            <button
              onClick={() => {
                onViewChange('rooms');
                onClose();
              }}
              className="w-full bg-blue-600 text-white text-sm font-medium py-2 px-3 rounded-md hover:bg-blue-700"
            >
              Start Recording
            </button>
          </div>
        </div>
      </div>
    </>
  );
};