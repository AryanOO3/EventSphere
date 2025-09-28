import React, { useState, useEffect, useContext } from 'react';
import styled from 'styled-components';
import { FaBell } from 'react-icons/fa';
import { AuthContext } from '../context/AuthContext';
import api from '../utils/api';

const NotificationWrapper = styled.div.withConfig({
  shouldForwardProp: (prop) => !['floating'].includes(prop)
})`
  position: ${props => props.floating ? 'fixed' : 'relative'};
  top: ${props => props.floating ? '20px' : 'auto'};
  right: ${props => props.floating ? '20px' : 'auto'};
  z-index: ${props => props.floating ? '998' : 'auto'};
  cursor: pointer;
  
  @media screen and (max-width: 960px) {
    display: none;
  }
`;

const BellButton = styled.div.withConfig({
  shouldForwardProp: (prop) => !['hasUnread'].includes(prop)
})`
  background: ${props => props.hasUnread ? 'linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)' : 'var(--gradient-primary)'};
  border-radius: 50%;
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: ${props => props.hasUnread ? '0 8px 25px rgba(255, 107, 107, 0.5)' : 'var(--box-shadow-xl)'};
  animation: ${props => props.hasUnread ? 'bellFloat 3s ease-in-out infinite, bellAlertPulse 2s ease-in-out infinite, bellShake 4s ease-in-out infinite' : 'bellFloat 3s ease-in-out infinite'};
  transition: var(--transition);
  position: relative;
  border: 3px solid rgba(255, 255, 255, 0.2);
  
  ${props => props.hasUnread && `
    &::after {
      content: '';
      position: absolute;
      top: -4px;
      left: -4px;
      right: -4px;
      bottom: -4px;
      border-radius: 50%;
      background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%);
      opacity: 0.3;
      animation: alertGlow 2s ease-in-out infinite;
      z-index: -1;
    }
  `}
  

  

  
  &:hover {
    transform: scale(1.15);
    box-shadow: ${props => props.hasUnread ? '0 12px 35px rgba(255, 107, 107, 0.6)' : '0 8px 32px rgba(155, 149, 255, 0.4)'};
    animation-play-state: paused;
  }
  
  &:active {
    transform: scale(1.05);
  }
  
  @keyframes bellFloat {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-10px); }
  }
  
  @keyframes bellAlertPulse {
    0%, 100% { box-shadow: 0 8px 25px rgba(255, 107, 107, 0.5), 0 0 0 0 rgba(255, 107, 107, 0.7); }
    50% { box-shadow: 0 8px 25px rgba(255, 107, 107, 0.5), 0 0 0 20px rgba(255, 107, 107, 0); }
  }
  
  @keyframes bellShake {
    0%, 100% { transform: translateY(0px) rotate(0deg); }
    10% { transform: translateY(-5px) rotate(3deg); }
    20% { transform: translateY(-10px) rotate(-3deg); }
    30% { transform: translateY(-5px) rotate(2deg); }
    40% { transform: translateY(-10px) rotate(-2deg); }
    50% { transform: translateY(-10px) rotate(0deg); }
  }
  
  @keyframes alertGlow {
    0%, 100% { transform: scale(1); opacity: 0.3; }
    50% { transform: scale(1.15); opacity: 0.1; }
  }
`;

const NotificationIcon = styled(FaBell).withConfig({
  shouldForwardProp: (prop) => !['floating', 'hasUnread'].includes(prop)
})`
  font-size: ${props => props.floating ? '1.8rem' : '1.2rem'};
  color: white;
  position: relative;
  transition: var(--transition);
  animation: ${props => props.floating && props.hasUnread ? 'bellRing 1.5s ease-in-out 0.5s infinite' : 'none'};
  filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3));
  
  @keyframes bellRing {
    0%, 85%, 100% { transform: rotate(0deg); }
    5%, 15%, 25% { transform: rotate(15deg); }
    10%, 20% { transform: rotate(-15deg); }
    30%, 40% { transform: rotate(10deg); }
    35% { transform: rotate(-10deg); }
  }
`;

const CountBadge = styled.div.withConfig({
  shouldForwardProp: (prop) => !['floating'].includes(prop)
})`
  position: absolute;
  top: ${props => props.floating ? '-8px' : '-5px'};
  right: ${props => props.floating ? '-8px' : '-5px'};
  background: linear-gradient(135deg, #ff4757 0%, #ff3742 100%);
  color: white;
  border-radius: 50%;
  width: ${props => props.floating ? '28px' : '18px'};
  height: ${props => props.floating ? '28px' : '18px'};
  font-size: ${props => props.floating ? '0.9rem' : '0.7rem'};
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  border: 3px solid white;
  box-shadow: 0 2px 8px rgba(255, 71, 87, 0.4);
  animation: badgeBounce 2s ease-in-out infinite;
  
  @keyframes badgeBounce {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.2); }
  }
`;



const NotificationBell = () => {
  const { currentUser } = useContext(AuthContext);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showTooltip, setShowTooltip] = useState(false);

  useEffect(() => {
    if (currentUser) {
      fetchNotifications();
    }
  }, [currentUser]);

  useEffect(() => {
    const handleNotificationAdded = () => {
      fetchNotifications();
    };
    window.addEventListener('notificationAdded', handleNotificationAdded);
    return () => window.removeEventListener('notificationAdded', handleNotificationAdded);
  }, []);

  const fetchNotifications = async () => {
    try {
      if (!currentUser?.id) return;
      
      const stored = localStorage.getItem(`notifications_${currentUser.id}`);
      const userNotifications = stored ? JSON.parse(stored) : [];
      
      setNotifications(userNotifications);
      setUnreadCount(userNotifications.filter(n => !n.read).length);
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    }
  };

  const handleBellClick = () => {
    // Mark all as read when bell is clicked
    if (unreadCount > 0 && currentUser?.id) {
      const updated = notifications.map(n => ({ ...n, read: true }));
      setNotifications(updated);
      localStorage.setItem(`notifications_${currentUser.id}`, JSON.stringify(updated));
      setUnreadCount(0);
    }
    window.dispatchEvent(new CustomEvent('openNotificationModal'));
  };

  if (!currentUser) return null;

  const hasUnread = unreadCount > 0;

  return (
    <NotificationWrapper floating={true}>
      <BellButton 
        hasUnread={hasUnread}
        onClick={handleBellClick}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        <NotificationIcon floating hasUnread={hasUnread} />
        {hasUnread && <CountBadge floating>{unreadCount > 99 ? '99+' : unreadCount}</CountBadge>}
      </BellButton>
    </NotificationWrapper>
  );
};

export default NotificationBell;