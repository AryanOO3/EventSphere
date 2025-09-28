import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import ThemeBackground from '../components/ThemeBackground';
import api from '../utils/api';

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 80px 40px;
  min-height: 100vh;
  position: relative;
  transition: var(--transition);
  
  @media screen and (max-width: 1024px) {
    padding: 60px 24px;
  }
  
  @media screen and (max-width: 768px) {
    padding: 40px 16px;
  }
`;

const PageTitle = styled.h1`
  font-size: 3rem;
  margin-bottom: 48px;
  color: var(--text-primary);
  font-weight: 800;
  letter-spacing: -0.02em;
  text-align: center;
  position: relative;
  
  span {
    background: var(--gradient-primary);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  
  @media screen and (max-width: 1024px) {
    font-size: 2.5rem;
    margin-bottom: 40px;
  }
  
  @media screen and (max-width: 768px) {
    font-size: 2rem;
    margin-bottom: 32px;
  }
`;

const StatsCard = styled.div`
  background: var(--gradient-primary);
  color: white;
  padding: 48px;
  border-radius: var(--border-radius-lg);
  text-align: center;
  margin-bottom: 48px;
  box-shadow: var(--box-shadow-xl);
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%);
    pointer-events: none;
  }
  
  h2 {
    font-size: 2.5rem;
    margin-bottom: 16px;
    font-weight: 800;
    text-shadow: 0 2px 4px rgba(0,0,0,0.2);
  }
  
  h3 {
    font-size: 1.8rem;
    font-weight: 600;
    opacity: 0.95;
    text-shadow: 0 1px 2px rgba(0,0,0,0.2);
  }
  
  @media screen and (max-width: 768px) {
    padding: 32px 24px;
    
    h2 {
      font-size: 2rem;
    }
    
    h3 {
      font-size: 1.5rem;
    }
  }
`;

const Section = styled.div`
  background: rgba(255, 255, 255, 0.02);
  backdrop-filter: blur(20px);
  border-radius: var(--border-radius-lg);
  padding: 48px;
  box-shadow: var(--box-shadow-xl);
  border: 1px solid var(--border-color);
  position: relative;
  overflow: hidden;
  transition: var(--transition);
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: var(--gradient-primary);
  }
  
  @media screen and (max-width: 768px) {
    padding: 32px 24px;
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  background: rgba(255, 255, 255, 0.02);
  backdrop-filter: blur(20px);
  border-radius: var(--border-radius);
  overflow: hidden;
  box-shadow: var(--box-shadow);
`;

const Th = styled.th`
  text-align: left;
  padding: 20px 16px;
  background: var(--bg-light);
  color: var(--text-primary);
  font-weight: 700;
  font-size: 1.1rem;
  border-bottom: 2px solid var(--border-color);
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: var(--gradient-primary);
    opacity: 0.3;
  }
  
  @media screen and (max-width: 768px) {
    padding: 16px 12px;
    font-size: 1rem;
  }
  
  @media screen and (max-width: 640px) {
    padding: 12px 8px;
    font-size: 0.9rem;
  }
`;

const Td = styled.td`
  padding: 20px 16px;
  border-bottom: 1px solid var(--border-color);
  color: var(--text-primary);
  font-weight: 500;
  transition: var(--transition);
  
  tr:hover & {
    background: var(--bg-light);
  }
  
  @media screen and (max-width: 768px) {
    padding: 16px 12px;
    font-size: 0.95rem;
  }
  
  @media screen and (max-width: 640px) {
    padding: 12px 8px;
    font-size: 0.9rem;
  }
`;

const TableRow = styled.tr`
  transition: var(--transition);
  
  &:hover {
    background: var(--bg-light);
    transform: translateY(-1px);
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  }
  
  &:nth-child(even) {
    background: rgba(108, 99, 255, 0.02);
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 80px 24px;
  color: var(--text-secondary);
  
  .icon {
    font-size: 5rem;
    margin-bottom: 32px;
    opacity: 0.7;
    background: var(--gradient-primary);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  
  h3 {
    font-size: 2rem;
    color: var(--text-primary);
    margin-bottom: 16px;
    font-weight: 700;
  }
  
  p {
    font-size: 1.2rem;
    font-weight: 500;
    line-height: 1.6;
    max-width: 500px;
    margin: 0 auto;
  }
  
  @media screen and (max-width: 768px) {
    padding: 60px 20px;
    
    .icon {
      font-size: 4rem;
      margin-bottom: 24px;
    }
    
    h3 {
      font-size: 1.8rem;
    }
    
    p {
      font-size: 1.1rem;
    }
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 20px;
  
  .spinner {
    width: 50px;
    height: 50px;
    border: 4px solid var(--border-color);
    border-top: 4px solid var(--primary);
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin-bottom: 24px;
  }
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  
  p {
    color: var(--text-secondary);
    font-size: 1.2rem;
    font-weight: 500;
  }
`;

const Badge = styled.span`
  background: var(--gradient-primary);
  color: white;
  padding: 4px 12px;
  border-radius: 16px;
  font-size: 0.85rem;
  font-weight: 600;
  letter-spacing: 0.02em;
  box-shadow: 0 2px 4px rgba(108, 99, 255, 0.2);
  
  @media screen and (max-width: 768px) {
    font-size: 0.8rem;
    padding: 3px 10px;
  }
`;

const CheckedInUsers = () => {
  const { eventId } = useParams();
  const [checkIns, setCheckIns] = useState([]);
  const [eventTitle, setEventTitle] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCheckIns();
    fetchEventDetails();
  }, [eventId]);

  const fetchCheckIns = async () => {
    try {
      const response = await api.get(`/qr/checkins/${eventId}`);
      setCheckIns(response.data.checkIns);
    } catch (error) {
      console.error('Failed to fetch check-ins:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchEventDetails = async () => {
    try {
      const response = await api.get(`/events/${eventId}`);
      setEventTitle(response.data.event.title);
    } catch (error) {
      console.error('Failed to fetch event details:', error);
    }
  };

  if (loading) {
    return (
      <Container>
        <LoadingContainer>
          <div className="spinner"></div>
          <p>Loading check-in data...</p>
        </LoadingContainer>
      </Container>
    );
  }

  return (
    <>
      <ThemeBackground />
      <Container style={{ position: 'relative', zIndex: 1 }}>
      <PageTitle className="animate-fade-in">Checked-In <span>Users</span></PageTitle>
      
      <StatsCard>
        <h2>{eventTitle}</h2>
        <h3>{checkIns.length} Users Checked In</h3>
      </StatsCard>

      <Section>
        {checkIns.length > 0 ? (
          <Table>
            <thead>
              <tr>
                <Th>Name</Th>
                <Th>Email</Th>
                <Th>Check-in Time</Th>
                <Th>Checked In By</Th>
                <Th>Status</Th>
              </tr>
            </thead>
            <tbody>
              {checkIns.map(checkIn => (
                <TableRow key={checkIn.id}>
                  <Td>{checkIn.name}</Td>
                  <Td>{checkIn.email}</Td>
                  <Td>{new Date(checkIn.checked_in_at).toLocaleString()}</Td>
                  <Td>{checkIn.checked_in_by_name || 'System'}</Td>
                  <Td>
                    <Badge>✓ Checked In</Badge>
                  </Td>
                </TableRow>
              ))}
            </tbody>
          </Table>
        ) : (
          <EmptyState>
            <div className="icon">👥</div>
            <h3>No Check-ins Yet</h3>
            <p>No users have checked in to this event yet. Check-ins will appear here once attendees scan their QR codes.</p>
          </EmptyState>
        )}
      </Section>
      </Container>
    </>
  );
};

export default CheckedInUsers;