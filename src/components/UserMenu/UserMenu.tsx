import { useAuthContext } from '../../contexts';
import { Dropdown, type DropdownItem } from '../Dropdown';
import './UserMenu.scss';

export function UserMenu() {
  const { user, logout } = useAuthContext();

  const getUserInitial = () => {
    if (user?.full_name) {
      return user.full_name.charAt(0).toUpperCase();
    }
    if (user?.email) {
      return user.email.charAt(0).toUpperCase();
    }
    return 'U';
  };

  const dropdownItems: DropdownItem[] = [
    {
      id: 'logout',
      label: 'Logout',
      icon: (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
      onClick: logout,
      variant: 'danger',
    },
  ];

  const trigger = (
    <button
      className="user-menu__trigger"
      aria-label="User menu"
    >
      <div className="user-menu__avatar">{getUserInitial()}</div>
      <div className="user-menu__info">
        <div className="user-menu__name">{user?.full_name || 'User'}</div>
        <div className="user-menu__email">{user?.email || 'user@example.com'}</div>
      </div>
    </button>
  );

  return (
    <div className="user-menu">
      <Dropdown trigger={trigger} items={dropdownItems} position="top-right" />
    </div>
  );
}
