// apps/frontend/src/components/dashboard/Dashboard.tsx
import React, { useState } from 'react';
import { useAuthStore } from '../../store/authStore';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';
import { DashboardHome } from './DashboardHome';
import { RecordingRooms } from './RecordingRooms';
// import { MyRecordings } from './MyRecordings';
// import { Settings } from './Settings';

type DashboardView = 'home' | 'rooms' | 'recordings' | 'settings';

export const Dashboard: React.FC = () => {
  const [currentView, setCurrentView] = useState<DashboardView>('home');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const user = useAuthStore((state) => state.user);

  const renderContent = () => {
    switch (currentView) {
      case 'home':
        return <DashboardHome onNavigate={setCurrentView} />;
      case 'rooms':
        return <RecordingRooms />;
      case 'recordings':
        // return <MyRecordings />;
        return <div>MyRecordings component coming soon.</div>;
      case 'settings':
        // return <Settings />;
        return <div>Settings component coming soon.</div>;
      default:
        return <DashboardHome onNavigate={setCurrentView} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <Navbar 
        user={user} 
        onMenuClick={() => setSidebarOpen(!sidebarOpen)}
      />

      <div className="flex">
        {/* Sidebar */}
        <Sidebar
          currentView={currentView}
          onViewChange={setCurrentView}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        {/* Main Content */}
        <div className="flex-1 lg:ml-64">
          <main className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              {renderContent()}
            </div>
          </main>
        </div>
      </div>
    </div>
  );

}