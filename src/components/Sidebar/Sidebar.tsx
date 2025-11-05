import { Link, useLocation } from 'react-router-dom';
import './Sidebar.scss';
import { UserMenu } from '../UserMenu';

interface NavItem {
  name: string;
  path: string;
  icon: string;
  count?: number;
}

interface Category {
  name: string;
  count: number;
}

const navItems: NavItem[] = [
  { name: 'All Documents', path: '/', icon: '📄', count: 156 },
  { name: 'Favorites', path: '/favorites', icon: '⭐', count: 12 },
  { name: 'Recent', path: '/recent', icon: '🕐', count: 24 },
  { name: 'Archived', path: '/archived', icon: '📦', count: 45 },
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

  return (
    <aside className="sidebar">
      <div className="sidebar__header">
        <div className="sidebar__logo">
          <div className="sidebar__logo-icon">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
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
          {navItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={`sidebar__nav-item ${location.pathname === item.path ? 'sidebar__nav-item--active' : ''}`}
                title={item.name}
              >
                    <span className="sidebar__nav-name">{item.name}</span>
                    {item.count !== undefined && (
                      <span className="sidebar__nav-count">{item.count}</span>
                    )}
              </Link>
            </li>
          ))}
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
