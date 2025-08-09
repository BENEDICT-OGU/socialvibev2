import React from 'react';

function MessageStatus({ status }) {
  const getStatusIcon = () => {
    switch (status) {
      case 'delivered':
        return '✓✓';
      case 'read':
        return '✓✓✓';
      case 'error':
        return '✗';
      default:
        return '✓';
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'read':
        return 'text-blue-500';
      case 'error':
        return 'text-red-500';
      default:
        return 'text-gray-400';
    }
  };

  return (
    <span className={`text-xs ${getStatusColor()}`}>
      {getStatusIcon()}
    </span>
  );
}

export default MessageStatus;