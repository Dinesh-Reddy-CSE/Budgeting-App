// client/src/context/NotificationsContext.jsx
import React, { createContext, useState } from 'react';
import { showNotification as showNotif } from '../services/notificationsService';

export const NotificationsContext = createContext();

export const NotificationsProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  const showNotification = (message, type = 'info') => {
    showNotif(message, type);
    
    // Also store in context state if needed for UI components
    const newNotification = {
      id: Date.now(),
      message,
      type,
      timestamp: new Date()
    };
    
    setNotifications(prev => [...prev, newNotification]);
  };

  const value = {
    notifications,
    showNotification
  };

  return (
    <NotificationsContext.Provider value={value}>
      {children}
    </NotificationsContext.Provider>
  );
};