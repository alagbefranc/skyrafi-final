import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  Briefcase, 
  UserCheck, 
  Settings, 
  LogOut,
  Menu,
  X,
  Bell,
  Search,
  ChevronDown,
  ClipboardList
} from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';
import skyrafiLogo from '../../assets/skyrafi-logo.png';

interface AdminLayoutProps {
  children: React.ReactNode;
  currentPage: string;
  userEmail?: string;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children, currentPage, userEmail }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navigation = [
    { 
      category: 'Overview', 
      items: [
        { name: 'Dashboard', href: '/admin', icon: LayoutDashboard, current: currentPage === 'dashboard' }
      ]
    },
    { 
      category: 'Recruitment', 
      items: [
        { name: 'Jobs', href: '/admin/jobs', icon: Briefcase, current: currentPage === 'jobs' },
        { name: 'Applications', href: '/admin/applications', icon: Users, current: currentPage === 'applications' }
      ]
    },
    { 
      category: 'Team & Users', 
      items: [
        { name: 'Survey Responses', href: '/admin/survey', icon: ClipboardList, current: currentPage === 'survey' },
        { name: 'Waitlist', href: '/admin/waitlist', icon: UserCheck, current: currentPage === 'waitlist' },
        { name: 'Employees', href: '/admin/employees', icon: Users, current: currentPage === 'employees' }
      ]
    },
    { 
      category: 'System', 
      items: [
        { name: 'Settings', href: '/admin/settings', icon: Settings, current: currentPage === 'settings' }
      ]
    }
  ];

  const signOut = async () => {
    await supabase.auth.signOut();
    window.location.href = '/admin/login';
  };

  return (
    <div className="h-screen flex overflow-hidden bg-gray-50">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 flex z-40 md:hidden">
          <div className="fixed inset-0 bg-gray-600 bg-opacity-75 transition-opacity" onClick={() => setSidebarOpen(false)} />
          <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white transition duration-300 transform ease-in-out">
            <div className="absolute top-0 right-0 -mr-12 pt-2">
              <button
                className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                onClick={() => setSidebarOpen(false)}
              >
                <X className="h-6 w-6 text-white" />
              </button>
            </div>
            <SidebarContent navigation={navigation} signOut={signOut} mobile />
          </div>
        </div>
      )}

      {/* Static sidebar for desktop */}
      <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 border-r border-gray-200 bg-white z-20">
        <SidebarContent navigation={navigation} signOut={signOut} />
      </div>

      {/* Main content */}
      <div className="md:pl-64 flex flex-col flex-1 w-0 transition-all duration-300">
        {/* Top nav */}
        <div className="relative z-10 flex-shrink-0 flex h-16 bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0">
          <button
            className="px-4 border-r border-gray-200 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-sky-blue-500 md:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </button>
          <div className="flex-1 px-6 flex justify-between">
            <div className="flex-1 flex items-center">
              <div className="w-full max-w-md lg:max-w-xs hidden sm:block">
                <div className="relative text-gray-400 focus-within:text-gray-600">
                  <div className="absolute inset-y-0 left-0 flex items-center pointer-events-none">
                    <Search className="h-4 w-4" />
                  </div>
                  <input
                    name="search"
                    id="search"
                    className="block w-full h-full pl-10 pr-3 py-2 border-none rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-0 sm:text-sm bg-gray-50/50 transition-all"
                    placeholder="Search anything..."
                    type="search"
                  />
                </div>
              </div>
            </div>
            <div className="ml-4 flex items-center md:ml-6 space-x-4">
              <button className="bg-white p-2 rounded-full text-gray-400 hover:text-sky-blue-600 focus:outline-none hover:bg-sky-blue-50 transition-colors relative">
                <Bell className="h-5 w-5" />
                <span className="absolute top-1.5 right-1.5 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
              </button>
              
              <div className="ml-3 relative">
                <div className="flex items-center gap-3 cursor-pointer py-1.5 pl-3 pr-2 rounded-xl hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100">
                  <div className="h-8 w-8 rounded-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center shadow-sm ring-2 ring-white">
                    <span className="text-xs font-bold text-white">
                      {userEmail?.charAt(0).toUpperCase() || 'A'}
                    </span>
                  </div>
                  <div className="hidden md:block text-left">
                    <div className="text-sm font-semibold text-gray-700 truncate max-w-[150px]">
                      {userEmail || 'Admin User'}
                    </div>
                  </div>
                  <ChevronDown className="h-4 w-4 text-gray-400 hidden md:block" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="flex-1 relative overflow-y-auto focus:outline-none scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent bg-gray-50/50">
          <div className="py-6">
            <div className="w-full mx-auto px-4 sm:px-6 md:px-8">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

const SidebarContent: React.FC<{ navigation: any[]; signOut: () => void; mobile?: boolean }> = ({ navigation, signOut, mobile }) => {
  return (
    <div className="flex-1 flex flex-col min-h-0 h-full bg-white">
      <div className="flex items-center flex-shrink-0 px-6 h-20 border-b border-gray-50">
        <img 
          src={skyrafiLogo} 
          alt="Skyrafi Logo" 
          className="h-12 w-auto"
        />
      </div>
      
      <div className="flex-1 flex flex-col pt-8 pb-4 overflow-y-auto px-4 scrollbar-thin scrollbar-thumb-gray-200">
        <nav className="space-y-8 flex-1">
          {navigation.map((group, index) => (
            <div key={group.category}>
              <h3 className="px-3 text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-3 font-mono">
                {group.category}
              </h3>
              <div className="space-y-1">
                {group.items.map((item: any) => (
                  <a
                    key={item.name}
                    href={item.href}
                    className={`${
                      item.current
                        ? 'bg-gray-900 text-white shadow-lg shadow-gray-900/20'
                        : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                    } group flex items-center px-3 py-2.5 text-sm font-medium rounded-xl transition-all duration-200 ease-in-out`}
                  >
                    <item.icon
                      className={`${
                        item.current ? 'text-white' : 'text-gray-400 group-hover:text-gray-500'
                      } mr-3 flex-shrink-0 h-5 w-5 transition-colors`}
                    />
                    {item.name}
                  </a>
                ))}
              </div>
            </div>
          ))}
        </nav>
        
        <div className="mt-auto pt-8 pb-4">
          <button
            onClick={signOut}
            className="w-full flex items-center px-3 py-2.5 text-sm font-medium text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200"
          >
            <LogOut className="mr-3 h-5 w-5" />
            Sign out
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
