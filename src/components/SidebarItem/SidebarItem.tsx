import { Link, useLocation } from 'react-router-dom';
import './SidebarItem.scss';
import type { DocumentStats } from '../../api/schema/documents';

export interface SidebarItemType {
  name: string;
  path: string;
  count?: number;
  icon?: React.ReactNode;
  countKey?: keyof DocumentStats;
}

interface SidebarItemProps {
  item: SidebarItemType;
  loading: boolean;
  collapsed?: boolean;
}

export function SidebarItem({ item, loading, collapsed }: SidebarItemProps) {
  const location = useLocation();
  return (
    <Link to={item.path} className={`sidebar-item ${location.pathname === item.path ? 'sidebar-item--active' : ''}`}>
      {item.icon && <div className="sidebar-item__icon">{item.icon}</div>}
      {!collapsed && <div className="sidebar-item__name">{item.name}</div>}
      {!collapsed && item.count !== undefined && (
        <div className="sidebar-item__count">{loading ? '...' : item.count}</div>
      )}
    </Link>
  );
}
