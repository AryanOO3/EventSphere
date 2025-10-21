import React, { useState, useEffect, useContext } from 'react';
import styled from 'styled-components';
import { AuthContext } from '../context/AuthContext';

const NotificationOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(8px);
  animation: fadeIn 0.3s ease-out;
  
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
`;

const NotificationPanel = styled.div`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: var(--border-radius-lg);
  width: 90%;
  max-width: 550px;
  max-height: 85vh;
  overflow: hidden;
  box-shadow: var(--box-shadow-xl);
  border: 1px solid var(--border-color);
  position: relative;
  transition: var(--transition);
  animation: slideIn 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  
  @keyframes slideIn {
    from { 
      opacity: 0;
      transform: translateY(-50px) scale(0.9);
    }
    to { 
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }
`;

const PanelHeader = styled.div`
  padding: 32px 32px 24px;
  border-bottom: 1px solid var(--border-color);
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(20px);
  transition: var(--transition);
  
  @media screen and (max-width: 768px) {
    padding: 24px 24px 20px;
  }
`;

const PanelTitle = styled.h2`
  color: var(--text-primary);
  margin: 0;
  font-size: 1.8rem;
  font-weight: 800;
  letter-spacing: -0.02em;
  
  span {
    background: var(--gradient-primary);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  
  @media screen and (max-width: 768px) {
    font-size: 1.6rem;
  }
`;

const DismissButton = styled.button`
  background: rgba(255, 255, 255, 0.02);
  backdrop-filter: blur(20px);
  border: 2px solid var(--border-color);
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  cursor: pointer;
  color: var(--text-secondary);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
    transition: left 0.5s;
  }
  
  &:hover::before {
    left: 100%;
  }
  
  &:hover {
    background: var(--primary);
    color: white;
    border-color: transparent;
    transform: rotate(90deg) scale(1.1);
    box-shadow: var(--box-shadow-lg);
  }
`;

const NotificationsContainer = styled.div`
  max-height: 60vh;
  overflow-y: auto;
  overflow-x: hidden;
  
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: var(--bg-light);
  }
  
  &::-webkit-scrollbar-thumb {
    background: var(--gradient-primary);
    border-radius: 3px;
  }
`;

const NotificationCard = styled.div`
  padding: 24px 32px;
  border-bottom: 1px solid var(--border-color);
  background: ${props => props.read ? 'rgba(255, 255, 255, 0.02)' : 'rgba(155, 149, 255, 0.08)'};
  backdrop-filter: blur(20px);
  position: relative;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  align-items: flex-start;
  gap: 16px;
  
  &:hover {
    background: rgba(255, 255, 255, 0.05);
    transform: translateX(4px);
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  }
  
  &:last-child {
    border-bottom: none;
  }
  
  @media screen and (max-width: 768px) {
    padding: 20px 24px;
  }
`;

const CardContent = styled.div`
  cursor: pointer;
  flex: 1;
`;

const RemoveButton = styled.button`
  background: rgba(255, 255, 255, 0.02);
  backdrop-filter: blur(20px);
  border: 1px solid var(--border-color);
  border-radius: 50%;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-secondary);
  cursor: pointer;
  font-size: 1rem;
  font-weight: bold;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  flex-shrink: 0;
  margin-top: 4px;
  
  &:hover {
    background: #ff4757;
    color: white;
    border-color: transparent;
    transform: scale(1.15) rotate(90deg);
    box-shadow: 0 6px 20px rgba(255, 71, 87, 0.4);
  }
  
  @media screen and (max-width: 768px) {
    width: 28px;
    height: 28px;
    font-size: 0.9rem;
  }
`;

const StatusIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: ${props => props.read ? 'var(--gradient-primary)' : 'linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)'};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  margin-bottom: 12px;
  box-shadow: ${props => props.read ? 'var(--box-shadow)' : '0 4px 20px rgba(255, 107, 107, 0.4)'};
  position: relative;
  transition: var(--transition);
  
  ${props => !props.read && `
    animation: alertPulse 2s infinite;
    
    &::before {
      content: '';
      position: absolute;
      top: -2px;
      left: -2px;
      right: -2px;
      bottom: -2px;
      border-radius: 50%;
      background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%);
      opacity: 0.3;
      animation: alertRing 2s infinite;
      z-index: -1;
    }
  `}
  
  @keyframes alertPulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.05); }
  }
  
  @keyframes alertRing {
    0% { transform: scale(1); opacity: 0.3; }
    50% { transform: scale(1.2); opacity: 0.1; }
    100% { transform: scale(1.4); opacity: 0; }
  }
`;

const CardTitle = styled.div`
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 8px;
  font-size: 1.1rem;
  line-height: 1.4;
`;

const CardMessage = styled.div`
  font-size: 0.95rem;
  color: var(--text-secondary);
  margin-bottom: 12px;
  line-height: 1.6;
`;

const TimeStamp = styled.div`
  font-size: 0.85rem;
  color: var(--text-secondary);
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 6px;
  
  &::before {
    content: '🕐';
    font-size: 0.8rem;
  }
`;

const EmptyNotifications = styled.div`
  padding: 80px 32px;
  text-align: center;
  color: var(--text-secondary);
  
  .icon {
    font-size: 4rem;
    margin-bottom: 24px;
    opacity: 0.7;
    background: var(--gradient-primary);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  
  h3 {
    font-size: 1.5rem;
    color: var(--text-primary);
    margin-bottom: 12px;
    font-weight: 700;
  }
  
  p {
    font-size: 1rem;
    font-weight: 500;
    line-height: 1.6;
  }
  
  @media screen and (max-width: 768px) {
    padding: 60px 24px;
    
    .icon {
      font-size: 3rem;
    }
    
    h3 {
      font-size: 1.3rem;
    }
  }
`;

const CounterStats = styled.div`
  display: flex;
  gap: 16px;
  margin-top: 8px;
  font-size: 0.8rem;
  color: var(--text-secondary);
  
  span {
    background: var(--bg-light);
    padding: 4px 8px;
    border-radius: 12px;
    font-weight: 600;
  }
`;

const ClearAllButton = styled.button`
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(20px);
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius);
  padding: 8px 16px;
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--text-secondary);
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  
  &:hover {
    background: #ff4757;
    color: white;
    border-color: transparent;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(255, 71, 87, 0.3);
  }
`;

const NotificationModal = ({ isOpen, onClose }) => {
  const { currentUser } = useContext(AuthContext);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    if (isOpen && currentUser) {
      fetchNotifications();
    }
  }, [isOpen, currentUser]);

  const fetchNotifications = async () => {
    try {
      if (!currentUser?.id) return;
      
      const stored = localStorage.getItem(`notifications_${currentUser.id}`);
      const userNotifications = stored ? JSON.parse(stored) : [];
      
      setNotifications(userNotifications);
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      if (!currentUser?.id) return;
      
      const updated = notifications.map(n => n.id === notificationId ? { ...n, read: true } : n);
      setNotifications(updated);
      localStorage.setItem(`notifications_${currentUser.id}`, JSON.stringify(updated));
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  };

  const deleteNotification = async (notificationId, e) => {
    e.stopPropagation();
    try {
      if (!currentUser?.id) return;
      
      const updated = notifications.filter(n => n.id !== notificationId);
      setNotifications(updated);
      localStorage.setItem(`notifications_${currentUser.id}`, JSON.stringify(updated));
    } catch (error) {
      console.error('Failed to delete notification:', error);
    }
  };

  const clearAllNotifications = async () => {
    try {
      if (!currentUser?.id) return;
      
      setNotifications([]);
      localStorage.setItem(`notifications_${currentUser.id}`, JSON.stringify([]));
    } catch (error) {
      console.error('Failed to clear all notifications:', error);
    }
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'rsvp': return '📝';
      case 'event': return '📅';
      case 'checkin': return '✅';
      default: return '🔔';
    }
  };

  if (!isOpen) return null;

  const unreadCount = notifications.filter(n => !n.read).length;
  const totalCount = notifications.length;

  return (
    <NotificationOverlay onClick={onClose}>
      <NotificationPanel onClick={(e) => e.stopPropagation()}>
        <PanelHeader>
          <div>
            <PanelTitle><span>Notifications</span></PanelTitle>
            {totalCount > 0 && (
              <CounterStats>
                <span>{unreadCount} unread</span>
                <span>{totalCount} total</span>
              </CounterStats>
            )}
          </div>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            {totalCount > 0 && (
              <ClearAllButton onClick={clearAllNotifications}>
                Clear All
              </ClearAllButton>
            )}
            <DismissButton onClick={onClose}>×</DismissButton>
          </div>
        </PanelHeader>
        
        <NotificationsContainer>
          {notifications.length > 0 ? (
            notifications.map(notification => (
              <NotificationCard
                key={notification.id}
                read={notification.read}
              >
                <CardContent onClick={() => markAsRead(notification.id)}>
                  <StatusIcon read={notification.read}>
                    {getNotificationIcon(notification.type)}
                  </StatusIcon>
                  <CardTitle>{notification.title}</CardTitle>
                  <CardMessage>{notification.message}</CardMessage>
                  <TimeStamp>{formatTime(notification.created_at)}</TimeStamp>
                </CardContent>
                <RemoveButton onClick={(e) => deleteNotification(notification.id, e)}>
                  ×
                </RemoveButton>
              </NotificationCard>
            ))
          ) : (
            <EmptyNotifications>
              <div className="icon">🔔</div>
              <h3>No Notifications</h3>
              <p>You're all caught up! New notifications will appear here when you receive them.</p>
            </EmptyNotifications>
          )}
        </NotificationsContainer>
      </NotificationPanel>
    </NotificationOverlay>
  );
};

export default NotificationModal;