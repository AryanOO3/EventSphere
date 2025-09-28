import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import EventFilters from '../components/EventFilters';
import ThemeBackground from '../components/ThemeBackground';
import api from '../utils/api';

const PageWrapper = styled.div`
  max-width: 1600px;
  margin: 0 auto;
  padding: 120px 40px;
  min-height: 100vh;
  position: relative;
  transition: var(--transition);
  
  @media screen and (max-width: 1024px) {
    padding: 80px 24px;
  }
  
  @media screen and (max-width: 768px) {
    padding: 60px 16px;
  }
`;

const MainHeading = styled.h1`
  font-size: 3rem;
  margin-bottom: 64px;
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
    margin-bottom: 48px;
  }
  
  @media screen and (max-width: 768px) {
    font-size: 2rem;
    margin-bottom: 40px;
  }
`;

const EventsLayout = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
  gap: 28px;
  margin-top: 48px;
  
  @media screen and (min-width: 1400px) {
    grid-template-columns: repeat(4, 1fr);
    gap: 32px;
  }
  
  @media screen and (max-width: 1200px) {
    grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
    gap: 24px;
  }
  
  @media screen and (max-width: 1024px) {
    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
    gap: 24px;
    margin-top: 40px;
  }
  
  @media screen and (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 20px;
    margin-top: 32px;
  }
`;

const EventItem = styled.div`
  background: rgba(255, 255, 255, 0.02);
  backdrop-filter: blur(20px);
  border-radius: var(--border-radius-lg);
  overflow: hidden;
  box-shadow: var(--box-shadow);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  border: 1px solid var(--border-color);
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: var(--gradient-primary);
    transform: scaleX(0);
    transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    z-index: 1;
  }
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, rgba(155, 149, 255, 0.05) 0%, rgba(196, 144, 255, 0.05) 100%);
    opacity: 0;
    transition: opacity 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    z-index: 0;
  }
  
  &:hover {
    transform: translateY(-12px) scale(1.02);
    box-shadow: var(--box-shadow-xl);
    border-color: var(--primary);
    
    &::before {
      transform: scaleX(1);
    }
    
    &::after {
      opacity: 1;
    }
  }
`;

const EventThumbnail = styled.img`
  width: 100%;
  height: 240px;
  object-fit: cover;
  object-position: center;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  z-index: 1;
  
  ${EventItem}:hover & {
    transform: scale(1.08);
    filter: brightness(1.1) saturate(1.2);
  }
  
  @media screen and (max-width: 768px) {
    height: 200px;
  }
`;

const EventDetails = styled.div`
  padding: 24px;
  position: relative;
  z-index: 1;
  transition: var(--transition);
  
  @media screen and (max-width: 768px) {
    padding: 20px;
  }
`;

const EventHeading = styled.h3`
  color: var(--text-primary);
  margin-bottom: 12px;
  font-weight: 700;
  font-size: 1.3rem;
  line-height: 1.4;
  
  @media screen and (max-width: 768px) {
    font-size: 1.2rem;
  }
`;

const EventInfo = styled.div`
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

const TagsContainer = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-top: 12px;
`;

const TagLabel = styled.span`
  background: var(--gradient-primary);
  color: white;
  padding: 4px 12px;
  border-radius: 16px;
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.02em;
  box-shadow: 0 2px 4px rgba(108, 99, 255, 0.2);
`;

const AttendanceStats = styled.div`
  display: flex;
  gap: 20px;
  margin-top: 16px;
  font-size: 0.9rem;
  color: var(--text-secondary);
  padding-top: 12px;
  border-top: 1px solid var(--border-color);
  
  span {
    display: flex;
    align-items: center;
    gap: 4px;
    font-weight: 600;
    
    &:first-child {
      color: var(--success);
    }
    
    &:last-child {
      color: var(--danger);
    }
  }
`;

const LoadingWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 20px;
  background: rgba(255, 255, 255, 0.02);
  backdrop-filter: blur(20px);
  border-radius: var(--border-radius-lg);
  box-shadow: var(--box-shadow);
  border: 1px solid var(--border-color);
  margin-top: 48px;
  
  p {
    margin-top: 16px;
    color: var(--text-secondary);
    font-size: 1.1rem;
    font-weight: 500;
  }
`;

const Spinner = styled.div`
  width: 40px;
  height: 40px;
  border: 4px solid var(--border-color);
  border-top: 4px solid var(--primary);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const EmptyMessage = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 120px 20px;
  text-align: center;
  background: rgba(255, 255, 255, 0.02);
  backdrop-filter: blur(20px);
  border-radius: var(--border-radius-lg);
  box-shadow: var(--box-shadow);
  border: 1px solid var(--border-color);
  margin-top: 48px;
  transition: var(--transition);
`;

const EmptyGraphic = styled.div`
  font-size: 5rem;
  margin-bottom: 32px;
  opacity: 0.7;
  background: var(--gradient-primary);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const EmptyHeading = styled.h3`
  font-size: 1.8rem;
  color: var(--text-primary);
  margin-bottom: 16px;
  font-weight: 700;
`;

const EmptyText = styled.p`
  color: var(--text-secondary);
  font-size: 1.1rem;
  max-width: 500px;
  line-height: 1.7;
`;

const EventSummary = styled.p`
  color: var(--text-secondary);
  line-height: 1.6;
  margin-bottom: 8px;
  font-size: 0.95rem;
`;

const Events = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [filters, setFilters] = useState({ category: '', tags: [] });
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchEvents();
    }, 300);
    
    return () => clearTimeout(timeoutId);
  }, [filters]);
  
  const fetchEvents = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filters.category) params.append('category', filters.category);
      if (filters.tags.length > 0) params.append('tags', filters.tags.join(','));
      
      const response = await api.get(`/events?${params}`);
      setEvents(response.data.events || []);
    } catch (error) {
      console.error('Failed to fetch events:', error);
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };
  
  const handleFilterChange = useCallback((newFilters) => {
    setLoading(true);
    setFilters(newFilters);
  }, []);
  
  return (
    <>
      <ThemeBackground />
      <PageWrapper style={{ position: 'relative', zIndex: 1 }}>
      <MainHeading className="animate-fade-in">Discover Amazing <span>Events</span></MainHeading>
      
      <EventFilters onFilterChange={handleFilterChange} />
      
      {loading ? (
        <LoadingWrapper>
          <Spinner />
          <p>Loading events...</p>
        </LoadingWrapper>
      ) : events.length > 0 ? (
        <EventsLayout>
          {events.map((event, index) => (
            <EventItem 
              key={event.id} 
              onClick={() => navigate(`/events/${event.id}`)}
              className="animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {(event.cover_image || event.event_image) && (
                <EventThumbnail 
                  src={`http://localhost:5000${event.cover_image || event.event_image}`} 
                  alt={event.title} 
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              )}
              <EventDetails>
                <EventHeading>{event.title}</EventHeading>
                <EventInfo>
                  <span>📅 {new Date(event.date).toLocaleDateString()}</span>
                  <span>📍 {event.location}</span>
                  {event.category_name && <span>🏷️ {event.category_name}</span>}
                </EventInfo>
                <EventSummary>
                  {event.description.length > 120 ? `${event.description.substring(0, 120)}...` : event.description}
                </EventSummary>
                {event.tags && event.tags.length > 0 && (
                  <TagsContainer>
                    {event.tags.slice(0, 3).map((tag, index) => (
                      <TagLabel key={index}>{tag}</TagLabel>
                    ))}
                    {event.tags.length > 3 && <span>+{event.tags.length - 3} more</span>}
                  </TagsContainer>
                )}
                <AttendanceStats>
                  <span>✓ {event.going_count || 0} Going</span>
                  <span>✗ {event.not_going_count || 0} Not Going</span>
                </AttendanceStats>
              </EventDetails>
            </EventItem>
          ))}
        </EventsLayout>
      ) : (
        <EmptyMessage>
          <EmptyGraphic>🎪</EmptyGraphic>
          <EmptyHeading>No Events Found</EmptyHeading>
          <EmptyText>
            No events match your current filters. Try adjusting your search criteria or check back later for new events.
          </EmptyText>
        </EmptyMessage>
      )}
      </PageWrapper>
    </>
  );
};

export default Events;