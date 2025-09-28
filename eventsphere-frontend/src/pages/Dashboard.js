import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import styled from 'styled-components';
import { AuthContext } from '../context/AuthContext';
import ThemeBackground from '../components/ThemeBackground';
import api from '../utils/api';

const Container = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 80px 40px;
  min-height: 100vh;
  
  @media screen and (max-width: 1024px) {
    padding: 60px 24px;
  }
  
  @media screen and (max-width: 768px) {
    padding: 40px 16px;
  }
`;

const WelcomeSection = styled.div`
  background: rgba(255, 255, 255, 0.02);
  backdrop-filter: blur(20px);
  border-radius: var(--border-radius-lg);
  padding: 48px;
  margin-bottom: 48px;
  box-shadow: var(--box-shadow-lg);
  border: 1px solid var(--border-color);
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: var(--gradient-primary);
    border-radius: var(--border-radius-lg) var(--border-radius-lg) 0 0;
  }
  
  @media screen and (max-width: 768px) {
    padding: 32px 24px;
    margin-bottom: 32px;
  }
`;

const WelcomeTitle = styled.h1`
  font-size: 2.8rem;
  color: var(--text-primary);
  margin-bottom: 16px;
  font-weight: 800;
  letter-spacing: -0.02em;
  
  span {
    background: var(--gradient-primary);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  
  @media screen and (max-width: 768px) {
    font-size: 2.2rem;
  }
  
  @media screen and (max-width: 480px) {
    font-size: 1.8rem;
  }
`;

const WelcomeSubtitle = styled.p`
  color: var(--text-secondary);
  font-size: 1.1rem;
  margin-bottom: 32px;
  
  @media screen and (max-width: 768px) {
    margin-bottom: 24px;
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 24px;
  margin-bottom: 48px;
  
  @media screen and (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
  }
  
  @media screen and (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

const StatCard = styled.div`
  background: rgba(255, 255, 255, 0.02);
  backdrop-filter: blur(20px);
  border-radius: var(--border-radius-lg);
  padding: 32px 24px;
  text-align: center;
  box-shadow: var(--box-shadow-lg);
  border: 1px solid var(--border-color);
  transition: var(--transition);
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: var(--gradient-primary);
  }
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: var(--box-shadow-xl);
  }
  
  @media screen and (max-width: 768px) {
    padding: 24px 20px;
  }
`;

const StatNumber = styled.h2`
  font-size: 3rem;
  background: var(--gradient-primary);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 12px;
  font-weight: 800;
  
  @media screen and (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

const StatLabel = styled.p`
  color: var(--text-secondary);
  font-weight: 600;
  font-size: 1.1rem;
  
  @media screen and (max-width: 768px) {
    font-size: 1rem;
  }
`;

const QuickActions = styled.div`
  background: rgba(255, 255, 255, 0.02);
  backdrop-filter: blur(20px);
  border-radius: var(--border-radius-lg);
  padding: 48px;
  box-shadow: var(--box-shadow-lg);
  border: 1px solid var(--border-color);
  margin-bottom: 48px;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: var(--gradient-primary);
    border-radius: var(--border-radius-lg) var(--border-radius-lg) 0 0;
  }
  
  @media screen and (max-width: 768px) {
    padding: 32px 24px;
    margin-bottom: 32px;
  }
`;

const SectionTitle = styled.h2`
  background: var(--gradient-primary);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 32px;
  font-size: 2rem;
  font-weight: 700;
  
  @media screen and (max-width: 768px) {
    font-size: 1.6rem;
  }
`;

const ActionsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 24px;
  
  @media screen and (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 16px;
  }
`;

const ActionCard = styled(Link)`
  display: block;
  background: rgba(255, 255, 255, 0.02);
  backdrop-filter: blur(20px);
  padding: 32px 24px;
  border-radius: var(--border-radius-lg);
  text-decoration: none;
  color: var(--text-primary);
  transition: var(--transition);
  border: 1px solid var(--border-color);
  box-shadow: var(--box-shadow);
  position: relative;
  overflow: hidden;
  
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
    transform: translateY(-4px);
    box-shadow: var(--box-shadow-xl);
    border-color: transparent;
    background: var(--gradient-primary);
    color: white;
    
    .action-title {
      color: white;
      background: none;
      -webkit-text-fill-color: white;
    }
    
    .action-desc {
      color: rgba(255, 255, 255, 0.9);
    }
  }
  
  .action-title {
    background: var(--gradient-primary);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    margin-bottom: 12px;
    font-size: 1.3rem;
    font-weight: 700;
  }
  
  .action-desc {
    color: var(--text-secondary);
    font-size: 1rem;
    line-height: 1.5;
  }
  
  @media screen and (max-width: 768px) {
    padding: 24px 20px;
    
    .action-title {
      font-size: 1.2rem;
    }
    
    .action-desc {
      font-size: 0.95rem;
    }
  }
`;

const EventsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
  gap: 24px;
  
  @media screen and (max-width: 1024px) {
    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  }
  
  @media screen and (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 20px;
  }
`;

const EventCard = styled.div`
  background: rgba(255, 255, 255, 0.02);
  backdrop-filter: blur(20px);
  border-radius: var(--border-radius-lg);
  padding: 24px;
  box-shadow: var(--box-shadow);
  transition: var(--transition);
  cursor: pointer;
  border: 1px solid var(--border-color);
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: var(--gradient-primary);
    transform: scaleX(0);
    transition: transform 0.3s ease;
  }
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: var(--box-shadow-xl);
    
    &::before {
      transform: scaleX(1);
    }
  }
  
  @media screen and (max-width: 768px) {
    padding: 20px;
  }
`;

const EventTitle = styled.h3`
  background: var(--gradient-primary);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 12px;
  font-size: 1.3rem;
  font-weight: 700;
  
  @media screen and (max-width: 768px) {
    font-size: 1.2rem;
  }
`;

const EventMeta = styled.div`
  display: flex;
  gap: 16px;
  margin-bottom: 12px;
  font-size: 0.9rem;
  color: var(--text-secondary);
  flex-wrap: wrap;
  
  span {
    display: flex;
    align-items: center;
    gap: 4px;
    font-weight: 500;
  }
  
  @media screen and (max-width: 640px) {
    gap: 12px;
    font-size: 0.85rem;
  }
`;

const EventDescription = styled.p`
  color: var(--text-secondary);
  line-height: 1.6;
  font-size: 0.95rem;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 48px 24px;
  color: var(--text-secondary);
  
  .icon {
    font-size: 3rem;
    margin-bottom: 16px;
    opacity: 0.5;
  }
  
  h3 {
    font-size: 1.2rem;
    margin-bottom: 8px;
    color: var(--text-primary);
  }
  
  p {
    font-size: 1rem;
    margin-bottom: 24px;
  }
`;

const Dashboard = () => {
  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [myEvents, setMyEvents] = useState([]);
  const [stats, setStats] = useState({ rsvped: 0, attended: 0 });

  useEffect(() => {
    if (currentUser) {
      if (currentUser.role === 'admin') {
        navigate('/admin/dashboard');
        return;
      }
      if (currentUser.role === 'superadmin') {
        navigate('/superadmin/dashboard');
        return;
      }
      
      fetchMyEvents();
    }
  }, [currentUser, navigate]);

  const fetchMyEvents = async () => {
    try {
      const statsResponse = await api.get('/events/user/dashboard-stats');
      setStats({
        rsvped: statsResponse.data.attending,
        attended: statsResponse.data.attended
      });
      
      const response = await api.get('/events');
      const allEvents = response.data.events;
      
      const rsvpPromises = allEvents.map(event => 
        api.get(`/events/${event.id}/rsvp`).catch(() => ({ data: { rsvp: null } }))
      );
      const rsvpResponses = await Promise.all(rsvpPromises);
      
      const attendingEvents = allEvents.filter((event, index) => 
        rsvpResponses[index].data.rsvp?.status === 'yes'
      );
      
      setMyEvents(attendingEvents);
    } catch (error) {
      console.error('Failed to fetch events:', error);
    }
  };
  
  return (
    <>
      <ThemeBackground />
      <Container style={{ position: 'relative', zIndex: 1 }}>
      <WelcomeSection className="animate-fade-in">
        <WelcomeTitle>
          Welcome back, <span>{currentUser?.name}</span>! 👋
        </WelcomeTitle>
        <WelcomeSubtitle>
          Here's an overview of your EventSphere activity and upcoming events
        </WelcomeSubtitle>
        
        <StatsGrid>
          <StatCard>
            <StatNumber>{stats.rsvped}</StatNumber>
            <StatLabel>Events Attending</StatLabel>
          </StatCard>
          <StatCard>
            <StatNumber>{stats.attended}</StatNumber>
            <StatLabel>Events Attended</StatLabel>
          </StatCard>
        </StatsGrid>
      </WelcomeSection>
      
      <QuickActions>
        <SectionTitle>Quick Actions</SectionTitle>
        <ActionsGrid>
          <ActionCard to="/events">
            <div className="action-title">🎯 Explore Events</div>
            <div className="action-desc">Discover and join exciting events happening around you</div>
          </ActionCard>
          <ActionCard to="/calendar">
            <div className="action-title">📅 View Calendar</div>
            <div className="action-desc">See all your events in a convenient calendar view</div>
          </ActionCard>
          <ActionCard to="/profile">
            <div className="action-title">👤 Manage Profile</div>
            <div className="action-desc">Update your profile information and preferences</div>
          </ActionCard>
        </ActionsGrid>
      </QuickActions>
      
      {myEvents.length > 0 ? (
        <WelcomeSection>
          <SectionTitle>My Upcoming Events</SectionTitle>
          <EventsGrid>
            {myEvents.map(event => (
              <EventCard key={event.id} onClick={() => navigate(`/events/${event.id}`)}>
                <EventTitle>{event.title}</EventTitle>
                <EventMeta>
                  <span>📅 {new Date(event.date).toLocaleDateString()}</span>
                  <span>📍 {event.location}</span>
                  {event.category_name && <span>🏷️ {event.category_name}</span>}
                </EventMeta>
                <EventDescription>
                  {event.description.length > 120 ? `${event.description.substring(0, 120)}...` : event.description}
                </EventDescription>
              </EventCard>
            ))}
          </EventsGrid>
        </WelcomeSection>
      ) : (
        <WelcomeSection>
          <EmptyState>
            <div className="icon">🎪</div>
            <h3>No Events Yet</h3>
            <p>You haven't RSVP'd to any events yet. Start exploring!</p>
            <ActionCard to="/events" style={{ display: 'inline-block', margin: '0 auto' }}>
              <div className="action-title">Browse Events</div>
              <div className="action-desc">Find events that interest you</div>
            </ActionCard>
          </EmptyState>
        </WelcomeSection>
      )}
      </Container>
    </>
  );
};

export default Dashboard;