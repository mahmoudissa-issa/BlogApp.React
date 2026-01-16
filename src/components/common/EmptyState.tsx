// src/components/common/EmptyState.tsx

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  message: string;
  actionButton?: {
    label: string;
    onClick: () => void;
  };
}

export default function EmptyState({ 
  icon, 
  title, 
  message, 
  actionButton 
}: EmptyStateProps) {
  return (
    <div className="empty-state">
      {icon ? (
        icon
      ) : (
        // Default icon
        <svg 
          width="64" 
          height="64" 
          fill="#9CA3AF" 
          viewBox="0 0 16 16"
          className="empty-state-icon"
        >
          <path d="M6 2a.5.5 0 0 1 .47.33L10 12.036l1.53-4.208A.5.5 0 0 1 12 7.5h3.5a.5.5 0 0 1 0 1h-3.15l-1.88 5.17a.5.5 0 0 1-.94 0L6 3.964 4.47 8.171A.5.5 0 0 1 4 8.5H.5a.5.5 0 0 1 0-1h3.15l1.88-5.17A.5.5 0 0 1 6 2Z"/>
        </svg>
      )}
      
      <h5 className="empty-state-title">{title}</h5>
      <p className="empty-state-message">{message}</p>
      
      {actionButton && (
        <button 
          className="btn btn-primary btn-sm mt-3"
          onClick={actionButton.onClick}
        >
          {actionButton.label}
        </button>
      )}
    </div>
  );
}