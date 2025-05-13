import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Twitter, Video, FileText, LinkIcon, Hash } from 'lucide-react';
import { Brain } from 'lucide-react';
const Sidebar = () => {
  const location = useLocation();
  const { isAuthenticated, logout } = useAuth();

  const isActive = (path) => {
    return location.pathname === path;
  };

  const navItems = [
    { name: 'Tweets', icon: <Twitter size={20} />, path: '/tweets' },
    { name: 'Videos', icon: <Video size={20} />, path: '/videos' },
    { name: 'Documents', icon: <FileText size={20} />, path: '/documents' },
    { name: 'Links', icon: <LinkIcon size={20} />, path: '/links' },
    { name: 'Tags', icon: <Hash size={20} />, path: '/tags' },
  ];

  return (
    <div className="min-h-screen w-64 bg-white border-r border-gray-200 flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <Link 
          to="/" 
          className="flex items-center space-x-2 text-xl font-semibold text-gray-800"
        >
          <Brain className="h-8 w-8 text-indigo-600" />
          <span>Second Brain</span>
        </Link>
      </div>

      <nav className="flex-1 pt-6 pb-8 px-2">
        <ul className="space-y-1">
          {navItems.map((item) => (
            <li key={item.name}>
              <Link
                to={item.path}
                className={`flex items-center px-4 py-3 text-sm font-medium rounded-md transition-colors duration-150 ${
                  isActive(item.path)
                    ? 'bg-indigo-50 text-indigo-600'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <span className="mr-3">{item.icon}</span>
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {isAuthenticated && (
        <div className="p-4 border-t border-gray-200">
          <button
            onClick={logout}
            className="w-full py-2 px-4 text-sm font-medium text-gray-700 hover:text-indigo-600 transition-colors duration-150"
          >
            Log out
          </button>
        </div>
      )}
    </div>
  );
};

export default Sidebar;