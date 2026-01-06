import { LogoIcon, StarIcon, ArchiveIcon, ClockIcon, FileOtherIcon, ArrowLeftToLineIcon } from '../../assets/icons';
import './Sidebar.scss';
import { UserMenu } from '../UserMenu';
import { useDocumentStats } from '../../hooks';
import { SidebarItem } from '../SidebarItem';
import { useTranslation } from 'react-i18next';
import type { SidebarItemType } from '../SidebarItem/SidebarItem';
import { useState } from 'react';

const navItems: SidebarItemType[] = [
  {
    name: 'allDocuments',
    path: '/',
    icon: <FileOtherIcon />,
    countKey: 'total_documents',
  },
  {
    name: 'favorites',
    path: '/favorites',
    icon: <StarIcon />,
    countKey: 'favorite_documents',
  },
  { name: 'recent', path: '/recent', icon: <ClockIcon /> },
  {
    name: 'archived',
    path: '/archived',
    icon: <ArchiveIcon />,
    countKey: 'archived_documents',
  },
];

const categories: SidebarItemType[] = [
  { name: 'technical', path: 'technical', countKey: 'technical_documents' },
  { name: 'marketing', path: 'marketing', countKey: 'marketing_documents' },
  { name: 'sales', path: 'sales', countKey: 'sales_documents' },
  { name: 'hr', path: 'hr', countKey: 'hr_documents' },
  { name: 'finance', path: 'finance', countKey: 'finance_documents' },
  { name: 'legal', path: 'legal', countKey: 'legal_documents' },
  { name: 'product', path: 'product', countKey: 'product_documents' },
];

export function Sidebar() {
  const { t } = useTranslation();
  const { data: stats, isLoading: loading } = useDocumentStats();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside className={`sidebar${collapsed ? ' sidebar--collapsed' : ''}`}>
      <div className="sidebar__header">
        <div className="sidebar__logo">
          <div className="sidebar__logo-icon">
            <LogoIcon />
          </div>
          {!collapsed && (
            <div className="sidebar__logo-text">
              <h1>{t('app.name')}</h1>
              <span>{t('app.subtitle')}</span>
            </div>
          )}
        </div>
      </div>

      <button
        className="sidebar__collapse-btn"
        aria-label={collapsed ? t('sidebar.expand') : t('sidebar.collapse')}
        onClick={() => setCollapsed((c) => !c)}
      >
        <ArrowLeftToLineIcon style={{ transform: collapsed ? 'rotate(180deg)' : 'none' }} />
      </button>

      <nav className="sidebar__nav">
        {!collapsed && <h3 className="sidebar__section-title">{t('sidebar.navigation')}</h3>}
        <ul className="sidebar__nav-list">
          {navItems.map((item) => {
            const count = item.countKey && stats ? stats[item.countKey] : undefined;
            return (
              <li key={item.path}>
                <SidebarItem
                  item={{ ...item, name: t(`sidebar.${item.name}`), count }}
                  loading={loading}
                  collapsed={collapsed}
                  key={item.path}
                />
              </li>
            );
          })}
        </ul>
      </nav>
      <div className="sidebar__nav">
        {!collapsed && <h3 className="sidebar__section-title">{t('sidebar.categories')}</h3>}
        <ul className="sidebar__nav-list">
          {categories.map((item) => {
            const count = item.countKey && stats ? stats[item.countKey] : undefined;
            return (
              <li key={item.path}>
                <SidebarItem
                  item={{ ...item, name: t(`sidebar.${item.name}`), count }}
                  loading={loading}
                  collapsed={collapsed}
                  key={item.path}
                />
              </li>
            );
          })}
        </ul>
      </div>
      <div className="sidebar__footer">{!collapsed && <UserMenu />}</div>
    </aside>
  );
}
