import { LogoIcon, StarIcon, ArchiveIcon, ClockIcon, FileOtherIcon } from '../../assets/icons';
import './Sidebar.scss';
import { UserMenu } from '../UserMenu';
import { useDocumentStats } from '../../hooks';
import { SidebarItem } from '../SidebarItem/SidebarItem';
import type { SidebarItemType } from '../SidebarItem/SidebarItem';

const navItems: SidebarItemType[] = [
  {
    name: 'All Documents',
    path: '/',
    icon: <FileOtherIcon />,
    countKey: 'total_documents',
  },
  {
    name: 'Favorites',
    path: '/favorites',
    icon: <StarIcon />,
    countKey: 'favorite_documents',
  },
  { name: 'Recent', path: '/recent', icon: <ClockIcon /> },
  {
    name: 'Archived',
    path: '/archived',
    icon: <ArchiveIcon />,
    countKey: 'archived_documents',
  },
];

const categories: SidebarItemType[] = [
  { name: 'Technical', count: 23, path: '' },
  { name: 'Marketing', count: 34, path: '' },
  { name: 'Sales', count: 18, path: '' },
  { name: 'HR', count: 15, path: '' },
  { name: 'Finance', count: 9, path: '' },
  { name: 'Legal', count: 12, path: '' },
  { name: 'Product', count: 26, path: '' },
];

export function Sidebar() {
  const { data: stats, isLoading: loading } = useDocumentStats();

  return (
    <aside className="sidebar">
      <div className="sidebar__header">
        <div className="sidebar__logo">
          <div className="sidebar__logo-icon">
            <LogoIcon />
          </div>
          <div className="sidebar__logo-text">
            <h1>Lucidexis</h1>
            <span>Knowledge Hub</span>
          </div>
        </div>
      </div>

      <nav className="sidebar__nav">
        <h3 className="sidebar__section-title">Navigation</h3>
        <ul className="sidebar__nav-list">
          {navItems.map((item) => {
            const count = item.countKey && stats ? stats[item.countKey] : undefined;
            return (
              <li key={item.path}>
                <SidebarItem item={{ ...item, count }} loading={loading} />
              </li>
            );
          })}
        </ul>
      </nav>
      <div className="sidebar__nav">
        <h3 className="sidebar__section-title">Categories</h3>
        <ul className="sidebar__nav-list">
          {categories.map((category) => (
            <li key={category.name}>
              <SidebarItem item={category} loading={false} />
            </li>
          ))}
        </ul>
      </div>
      <div className="sidebar__footer">
        <UserMenu />
      </div>
    </aside>
  );
}
