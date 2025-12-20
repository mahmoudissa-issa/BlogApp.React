// src/components/common/ErrorAlert.tsx
import React from 'react';

interface ErrorAlertProps {
  message: string;
  onRetry?: () => void;
  dismissible?: boolean;
  onDismiss?: () => void;
}

export default function ErrorAlert({ 
  message, 
  onRetry, 
  dismissible = false,
  onDismiss 
}: ErrorAlertProps) {
  return (
    <div className="container my-4">
      <div className="alert alert-danger d-flex align-items-start" role="alert">
        {/* Error Icon */}
        <svg 
          className="flex-shrink-0 me-3" 
          width="24" 
          height="24" 
          fill="currentColor" 
          viewBox="0 0 16 16"
        >
          <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/>
        </svg>
        
        {/* Error Content */}
        <div className="flex-grow-1">
          <h6 className="alert-heading mb-1">Unable to Load Content</h6>
          <p className="mb-0 small">{message}</p>
          
          {/* Retry Button */}
          {onRetry && (
            <button 
              className="btn btn-sm btn-outline-danger mt-2"
              onClick={onRetry}
            >
              <svg width="16" height="16" fill="currentColor" className="me-1" viewBox="0 0 16 16">
                <path fillRule="evenodd" d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2v1z"/>
                <path d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466z"/>
              </svg>
              Try Again
            </button>
          )}
        </div>
        
        {/* Dismiss Button */}
        {dismissible && onDismiss && (
          <button 
            type="button" 
            className="btn-close" 
            onClick={onDismiss}
            aria-label="Close"
          ></button>
        )}
      </div>
    </div>
  );
}