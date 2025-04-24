import { NavLink } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex items-center space-x-8 py-4">
            <NavLink
              to="/form-builder"
              className={({ isActive }) => `
                inline-flex items-center px-3 py-2 text-sm font-medium
                transition-colors rounded-md
                ${isActive 
                  ? 'bg-gray-100 text-gray-900' 
                  : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'}
              `}
            >
              Form Builder
            </NavLink>
            
            <NavLink
              to="/audio-chat"
              className={({ isActive }) => `
                inline-flex items-center px-3 py-2 text-sm font-medium
                transition-colors rounded-md
                ${isActive 
                  ? 'bg-gray-100 text-gray-900' 
                  : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'}
              `}
            >
              Audio Chat
            </NavLink>
          </div>
      </div>
    </nav>
  );
};

export default Navbar;
