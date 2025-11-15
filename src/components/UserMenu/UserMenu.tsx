import { useAuthContext } from '../../contexts';
import { Dropdown, type DropdownItem } from '../Dropdown';
import { LogoutIcon } from '../../assets/icons';
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
      icon: <LogoutIcon />,
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
