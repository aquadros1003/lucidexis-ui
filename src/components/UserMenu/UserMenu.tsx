import { useState, useRef, useEffect } from 'react';
import { useAuthContext } from '../../contexts';
import './UserMenu.scss';

export function UserMenu() {
  const { user, logout } = useAuthContext();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen]);

  const handleLogout = () => {
    setIsMenuOpen(false);
    logout();
  };

  const getUserInitial = () => {
    if (user?.full_name) {
      return user.full_name.charAt(0).toUpperCase();
    }
    if (user?.email) {
      return user.email.charAt(0).toUpperCase();
    }
    return 'U';
  };

  return (
    <div className="user-menu" ref={menuRef}>
      <button
        className="user-menu__trigger"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        aria-label="User menu"
        aria-expanded={isMenuOpen}
      >
        <div className="user-menu__avatar">{getUserInitial()}</div>
        <div className="user-menu__info">
          <div className="user-menu__name">{user?.full_name || 'User'}</div>
          <div className="user-menu__email">{user?.email || 'user@example.com'}</div>
        </div>
      </button>

      {isMenuOpen && (
        <div className="user-menu__dropdown">
          <button className="user-menu__dropdown-item" onClick={handleLogout}>
            Logout
            <svg
              className="user-menu__dropdown-icon"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9"
                stroke="red"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}
