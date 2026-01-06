import './EmptyState.scss';
import { EmptyDocumentIcon } from '../../assets/icons';
import type { ReactNode } from 'react';

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: ReactNode;
}

export function EmptyState({ title, description, icon }: EmptyStateProps) {
  return (
    <div className="empty-state">
      {icon || <EmptyDocumentIcon className="empty-state__illustration" />}
      <div className="empty-state__content">
        <h2 className="empty-state__title">{title}</h2>
        <p className="empty-state__description">{description}</p>
      </div>
    </div>
  );
}
