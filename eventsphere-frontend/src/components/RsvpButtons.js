import React, { useState, useEffect, useContext, useCallback } from 'react';
import styled from 'styled-components';
import { AuthContext } from '../context/AuthContext';
import api from '../utils/api';
import { addNotification, createRsvpNotification } from '../utils/notifications';

const ButtonWrapper = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 20px;
  flex-wrap: wrap;
  
  @media screen and (max-width: 640px) {
    gap: 8px;
    justify-content: center;
  }
  
  @media screen and (max-width: 480px) {
    flex-direction: column;
    align-items: center;
    gap: 12px;
  }
`;

const ActionButton = styled.button`
  padding: 12px 24px;
  border: 2px solid ${props => props.selected ? 'transparent' : 'var(--border-color)'};
  border-radius: var(--border-radius);
  background: ${props => props.selected ? 'var(--gradient-primary)' : 'var(--bg-white)'};
  color: ${props => props.selected ? 'white' : 'var(--text-primary)'};
  cursor: pointer;
  font-weight: 600;
  font-size: 14px;
  transition: var(--transition);
  position: relative;
  overflow: hidden;
  box-shadow: ${props => props.selected ? 'var(--box-shadow-lg)' : 'var(--box-shadow)'};
  min-width: 120px;
  outline: none !important;
  
  &:focus {
    outline: none !important;
  }
  
  @media screen and (max-width: 640px) {
    padding: 10px 20px;
    font-size: 13px;
    min-width: 100px;
  }
  
  @media screen and (max-width: 480px) {
    padding: 12px 32px;
    font-size: 14px;
    min-width: 160px;
    width: 100%;
    max-width: 200px;
  }
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
    transition: left 0.5s;
  }
  
  &:hover::before {
    left: 100%;
  }
  
  &:hover {
    border-color: var(--primary);
    background: ${props => props.selected ? 'var(--primary-dark)' : 'var(--primary)'};
    color: white;
    transform: translateY(-2px);
    box-shadow: var(--box-shadow-xl);
    outline: none !important;
  }
  
  &:active {
    transform: translateY(0);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
    
    &:hover {
      transform: none;
      box-shadow: var(--box-shadow);
    }
  }
`;

const RsvpButtons = ({ eventId }) => {
  const { currentUser } = useContext(AuthContext);
  const [rsvpStatus, setRsvpStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [qrCode, setQrCode] = useState(null);
  const [showQr, setShowQr] = useState(false);
  const [isCheckedIn, setIsCheckedIn] = useState(false);

  const fetchUserRsvp = useCallback(async () => {
    try {
      const response = await api.get(`/events/${eventId}/rsvp`);
      setRsvpStatus(response.data.rsvp?.status || null);
      setIsCheckedIn(response.data.rsvp?.is_checked_in || false);
      if (response.data.rsvp?.status === 'yes' && response.data.qrCode) {
        setQrCode(response.data.qrCode);
        setShowQr(true);
      }
    } catch (error) {
      if (error.response?.status === 401) {
        localStorage.clear();
        window.location.href = '/login';
      }
    }
  }, [eventId]);

  useEffect(() => {
    if (currentUser && eventId) {
      fetchUserRsvp();
    }
  }, [currentUser, eventId, fetchUserRsvp]);

  const handleRsvp = async (status) => {
    if (!currentUser) {
      alert('Please log in to RSVP for events.');
      return;
    }
    
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please log in again.');
      window.location.href = '/login';
      return;
    }
    
    setLoading(true);
    try {
      const response = await api.post(`/events/${eventId}/rsvp`, { status });
      setRsvpStatus(status);
      if (status === 'yes' && response.data.qrCode) {
        setQrCode(response.data.qrCode);
        setShowQr(true);
      } else if (status === 'no') {
        setQrCode(null);
        setShowQr(false);
      }
      
      const eventTitle = response.data.eventTitle || 'Event';
      addNotification(createRsvpNotification(eventTitle, status));
      window.dispatchEvent(new CustomEvent('notificationAdded'));
      
    } catch (error) {
      if (error.response?.status === 401) {
        localStorage.clear();
        window.location.href = '/login';
      } else {
        alert(error.response?.data?.error || 'Failed to update RSVP.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (!currentUser) {
    return null;
  }

  return (
    <div>
      <ButtonWrapper>
        <ActionButton
          selected={rsvpStatus === 'yes'}
          disabled={loading || isCheckedIn}
          onClick={() => handleRsvp('yes')}
        >
          ✓ Going
        </ActionButton>
        <ActionButton
          selected={rsvpStatus === 'no'}
          disabled={loading || isCheckedIn}
          onClick={() => handleRsvp('no')}
        >
          ✗ Not Going
        </ActionButton>
        {rsvpStatus === 'yes' && (
          <ActionButton
            selected={true}
            onClick={() => setShowQr(!showQr)}
          >
            {showQr ? 'Hide QR' : 'Show QR'}
          </ActionButton>
        )}
      </ButtonWrapper>
      
      {rsvpStatus === 'yes' && showQr && qrCode && (
        <div style={{ 
          textAlign: 'center', 
          marginTop: '24px',
          padding: '20px',
          background: 'var(--bg-white)',
          borderRadius: 'var(--border-radius)',
          boxShadow: 'var(--box-shadow)',
          border: '1px solid var(--border-color)'
        }} className="animate-fade-in">
          <img 
            src={qrCode} 
            alt="QR Code" 
            style={{ 
              maxWidth: '180px', 
              border: '2px solid var(--border-color)', 
              borderRadius: 'var(--border-radius)',
              boxShadow: 'var(--box-shadow)'
            }} 
          />
          <p style={{ 
            fontSize: '14px', 
            color: 'var(--text-secondary)', 
            margin: '12px 0 0 0',
            fontWeight: '500'
          }}>Show this QR code for check-in</p>
        </div>
      )}
    </div>
  );
};

export default RsvpButtons;