import { Link, useLocation } from 'react-router-dom';
import { LogoIcon, StarIcon, ArchiveIcon, ClockIcon, FileOtherIcon } from '../../assets/icons';
import './Sidebar.scss';
import { UserMenu } from '../UserMenu';
import { useDocumentStats } from '../../hooks';
import type { DocumentStats } from '../../api/hooks/documents';

interface NavItem {
  name: string;
  path: string;
  icon: React.ReactNode;
  countKey?: keyof DocumentStats;
}

interface Category {
  name: string;
  count: number;
}

const navItems: NavItem[] = [
  { name: 'All Documents', path: '/', icon: <FileOtherIcon/>, countKey: 'total_documents' },
  { name: 'Favorites', path: '/favorites', icon: <StarIcon/>, countKey: 'favorite_documents' },
  { name: 'Recent', path: '/recent', icon: <ClockIcon/> },
  { name: 'Archived', path: '/archived', icon: <ArchiveIcon/>, countKey: 'archived_documents' },
];

const categories: Category[] = [
  { name: 'Technical', count: 23 },
  { name: 'Marketing', count: 34 },
  { name: 'Sales', count: 18 },
  { name: 'HR', count: 15 },
  { name: 'Finance', count: 28 },
  { name: 'Legal', count: 12 },
  { name: 'Product', count: 26 },
];

export function Sidebar() {
  const location = useLocation();
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
                <Link
                  to={item.path}
                  className={`sidebar__nav-item ${location.pathname === item.path ? 'sidebar__nav-item--active' : ''}`}
                  title={item.name}
                >
                  <span className="sidebar__nav-icon" aria-hidden="true">
                    {item.icon}
                  </span>
                  <span className="sidebar__nav-name">{item.name}</span>
                  {!loading && count !== undefined && (
                    <span className="sidebar__nav-count">{count}</span>
                  )}
                </Link>
              </li>
            );
          })} 
        </ul>
      </nav>
        <div className="sidebar__categories">
          <h3 className="sidebar__section-title">Categories</h3>
          <ul className="sidebar__category-list">
            {categories.map((category) => (
              <li key={category.name} className="sidebar__category-item">
                <span className="sidebar__category-name">{category.name}</span>
                <span className="sidebar__category-count">{category.count}</span>
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
