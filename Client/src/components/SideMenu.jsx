import React, { useState } from 'react';
import { 
  FaComment, 
  FaUserFriends, 
  FaBell,
  FaEllipsisH,
  FaUserCircle,
  FaCog,
  FaArchive,
  FaStar
} from 'react-icons/fa';
import { BsThreeDotsVertical, BsCameraVideo } from 'react-icons/bs';
import { IoMdNotificationsOutline } from 'react-icons/io';

const SideMenu = () => {
  const [activeTab, setActiveTab] = useState('chat');

  const menuItems = [
    { id: 'chat', icon: <FaComment size={20} />, tooltip: 'Chats' },
    { id: 'status', icon: <FaUserFriends size={20} />, tooltip: 'Status' },
    { id: 'channels', icon: <FaBell size={20} />, tooltip: 'Channels' },
    { id: 'groups', icon: <FaUserFriends size={20} />, tooltip: 'Groups' },
    { id: 'calls', icon: <BsCameraVideo size={20} />, tooltip: 'Calls' },
    { id: 'archive', icon: <FaArchive size={20} />, tooltip: 'Archive' },
    { id: 'starred', icon: <FaStar size={20} />, tooltip: 'Starred' },
    { id: 'settings', icon: <FaCog size={20} />, tooltip: 'Settings' },
    { id: 'profile', icon: <FaUserCircle size={20} />, tooltip: 'Profile' }
  ];

  return (
    <div className="flex flex-col items-center w-16 bg-gray-100 border-r border-gray-200 h-full py-4 space-y-6">
      {/* WhatsApp logo placeholder */}
      {/* <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center text-white mb-6">
        <span className="text-xl font-bold">W</span>
      </div> */}

      {/* Menu items */}
      <div className="flex flex-col items-center space-y-6 flex-1">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`p-2 rounded-full relative group ${
              activeTab === item.id ? 'bg-gray-200 text-green-600' : 'text-gray-600 hover:bg-gray-200'
            }`}
          >
            {item.icon}
            <span className="absolute left-full ml-2 px-2 py-1 text-sm rounded-full bg-gray-800 text-white opacity-0 group-hover:opacity-100 whitespace-nowrap z-20">
              {item.tooltip}
            </span>
          </button>
        ))}
      </div>

      
    </div>
  );
};

export default SideMenu;