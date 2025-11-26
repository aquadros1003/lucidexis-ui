import { LogoIcon, StarIcon, ArchiveIcon, ClockIcon, FileOtherIcon } from '../../assets/icons';
import './Sidebar.scss';
import { UserMenu } from '../UserMenu';
import { useDocumentStats } from '../../hooks';
import { SidebarItem } from '../SidebarItem/SidebarItem';
import { useTranslation } from 'react-i18next';
import type { SidebarItemType } from '../SidebarItem/SidebarItem';

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
  { name: 'technical', count: 23, path: '' },
  { name: 'marketing', count: 34, path: '' },
  { name: 'sales', count: 18, path: '' },
  { name: 'hr', count: 15, path: '' },
  { name: 'finance', count: 9, path: '' },
  { name: 'legal', count: 12, path: '' },
  { name: 'product', count: 26, path: '' },
];

export function Sidebar() {
  const { t } = useTranslation();
  const { data: stats, isLoading: loading } = useDocumentStats();

  return (
    <aside className="sidebar">
      <div className="sidebar__header">
        <div className="sidebar__logo">
          <div className="sidebar__logo-icon">
            <LogoIcon />
          </div>
          <div className="sidebar__logo-text">
            <h1>{t('app.name')}</h1>
            <span>{t('app.subtitle')}</span>
          </div>
        </div>
      </div>

      <nav className="sidebar__nav">
        <h3 className="sidebar__section-title">{t('sidebar.navigation')}</h3>
        <ul className="sidebar__nav-list">
          {navItems.map((item) => {
            const count = item.countKey && stats ? stats[item.countKey] : undefined;
            return (
              <li key={item.path}>
                <SidebarItem item={{ ...item, name: t(`sidebar.${item.name}`), count }} loading={loading} />
              </li>
            );
          })}
        </ul>
      </nav>
      <div className="sidebar__nav">
        <h3 className="sidebar__section-title">{t('sidebar.categories')}</h3>
        <ul className="sidebar__nav-list">
          {categories.map((category) => (
            <li key={category.name}>
              <SidebarItem item={{ ...category, name: t(`sidebar.${category.name}`) }} loading={false} />
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
