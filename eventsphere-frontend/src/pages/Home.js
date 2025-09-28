import React, { useState, useEffect, useCallback, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import EventFilters from '../components/EventFilters';
import Logo from '../components/Logo';
import ThemeBackground from '../components/ThemeBackground';
import { AuthContext } from '../context/AuthContext';
import api from '../utils/api';

const HeroSection = styled.section`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 80px 20px;
  min-height: 90vh;
  overflow: hidden;
  width: 100vw;
  margin-left: calc(-50vw + 50%);
  
  @media screen and (max-width: 1024px) {
    padding: 60px 20px;
    min-height: 80vh;
  }
  
  @media screen and (max-width: 768px) {
    padding: 40px 16px;
    min-height: 70vh;
  }
`;

const VideoBackground = styled.video`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: -2;
`;

const VideoOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, rgba(108, 99, 255, 0.3) 0%, rgba(0, 0, 0, 0.5) 100%);
  z-index: -1;
`;

const HeroContent = styled.div`
  position: relative;
  z-index: 1;
  text-align: center;
  max-width: 800px;
`;

const HeroTitle = styled.h1`
  font-size: 4rem;
  margin-bottom: 24px;
  color: white;
  text-shadow: 2px 2px 8px rgba(0, 0, 0, 0.8);
  font-weight: 800;
  line-height: 1.2;
  letter-spacing: -0.02em;
  
  span {
    background: linear-gradient(135deg, #9B95FF 0%, #C490FF 50%, #E0A8FF 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    text-shadow: 0 0 20px rgba(139, 127, 255, 0.3);
    animation: shimmer 3s ease-in-out infinite;
  }
  
  @keyframes shimmer {
    0%, 100% { filter: brightness(1); }
    50% { filter: brightness(1.15); }
  }
  
  @media screen and (max-width: 1024px) {
    font-size: 3.2rem;
  }
  
  @media screen and (max-width: 768px) {
    font-size: 2.4rem;
    margin-bottom: 20px;
  }
  
  @media screen and (max-width: 480px) {
    font-size: 2rem;
  }
`;

const HeroSubtitle = styled.p`
  font-size: 1.3rem;
  margin: 0 auto 40px;
  color: rgba(255, 255, 255, 0.95);
  max-width: 700px;
  text-shadow: 1px 1px 4px rgba(0, 0, 0, 0.8);
  text-align: center;
  font-weight: 400;
  line-height: 1.6;
  
  @media screen and (max-width: 1024px) {
    font-size: 1.1rem;
    max-width: 600px;
  }
  
  @media screen and (max-width: 768px) {
    font-size: 1rem;
    margin-bottom: 32px;
    max-width: 500px;
  }
  
  @media screen and (max-width: 480px) {
    font-size: 0.95rem;
    margin-bottom: 28px;
  }
`;



const ButtonGroup = styled.div`
  display: flex;
  gap: 24px;
  justify-content: center;
  flex-wrap: wrap;
  
  @media screen and (max-width: 480px) {
    gap: 16px;
    flex-direction: column;
    align-items: center;
  }
`;

const HeroButton = styled(Link)`
  display: inline-block;
  padding: 16px 40px;
  background: ${props => props.$primary ? 'var(--gradient-primary)' : 'rgba(255, 255, 255, 0.1)'};
  color: white;
  border: 2px solid ${props => props.$primary ? 'transparent' : 'rgba(255, 255, 255, 0.3)'};
  border-radius: var(--border-radius);
  font-weight: 700;
  font-size: 1.1rem;
  transition: var(--transition);
  text-decoration: none;
  position: relative;
  overflow: hidden;
  backdrop-filter: blur(10px);
  box-shadow: ${props => props.$primary ? 'var(--box-shadow-lg)' : '0 4px 15px rgba(0, 0, 0, 0.2)'};
  
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
    background: ${props => props.$primary ? 'linear-gradient(135deg, #8B7FFF 0%, #B490FF 50%, #D8A7FF 100%)' : 'rgba(255, 255, 255, 0.2)'};
    color: white;
    border-color: transparent;
  }
  
  [data-theme="light"] & {
    ${props => !props.$primary && `
      background: rgba(255, 255, 255, 0.9);
      border-color: rgba(255, 255, 255, 0.7);
      background: linear-gradient(135deg, #9B95FF 0%, #C490FF 50%, #E0A8FF 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      box-shadow: 0 4px 15px rgba(255, 255, 255, 0.3);
      
      &:hover {
        background: linear-gradient(135deg, #8B7FFF 0%, #B490FF 50%, #D8A7FF 100%);
        -webkit-background-clip: initial;
        -webkit-text-fill-color: white;
        background-clip: initial;
        border-color: rgba(255, 255, 255, 0.9);
      }
    `}
  }
  
  @media screen and (max-width: 768px) {
    padding: 14px 32px;
    font-size: 1rem;
  }
  
  @media screen and (max-width: 480px) {
    padding: 12px 28px;
    font-size: 0.95rem;
    width: 200px;
    text-align: center;
  }
`;

const FeaturesSection = styled.section`
  padding: 120px 0;
  background: var(--bg-body);
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, var(--border-color), transparent);
  }
  
  @media screen and (max-width: 768px) {
    padding: 80px 0;
  }
`;

const SectionTitle = styled.h2`
  font-size: 3rem;
  text-align: center;
  margin-bottom: 64px;
  color: var(--text-primary);
  font-weight: 800;
  letter-spacing: -0.02em;
  
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

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 40px;
  
  @media screen and (max-width: 1024px) {
    gap: 32px;
  }
  
  @media screen and (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 24px;
  }
`;

const FeatureCard = styled.div`
  background: rgba(255, 255, 255, 0.02);
  backdrop-filter: blur(20px);
  border-radius: var(--border-radius-lg);
  padding: 40px 32px;
  box-shadow: var(--box-shadow);
  transition: var(--transition);
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
    transform: scaleX(0);
    transition: transform 0.3s ease;
  }
  
  &:hover {
    transform: translateY(-12px);
    box-shadow: var(--box-shadow-xl);
    
    &::before {
      transform: scaleX(1);
    }
  }
  
  @media screen and (max-width: 768px) {
    padding: 32px 24px;
  }
`;

const FeatureTitle = styled.h3`
  font-size: 1.6rem;
  margin-bottom: 16px;
  color: var(--text-primary);
  font-weight: 700;
  
  @media screen and (max-width: 768px) {
    font-size: 1.4rem;
  }
`;

const FeatureDescription = styled.p`
  color: var(--text-secondary);
  line-height: 1.7;
  font-size: 1rem;
  
  @media screen and (max-width: 768px) {
    font-size: 0.95rem;
  }
`;

const EventsSection = styled.section`
  padding: 120px 0;
  background: var(--bg-body);
  position: relative;
  overflow: hidden;
  
  @media screen and (max-width: 768px) {
    padding: 80px 0;
  }
`;

const EventsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
  gap: 32px;
  margin-top: 48px;
  
  @media screen and (max-width: 1024px) {
    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
    gap: 24px;
  }
  
  @media screen and (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 20px;
    margin-top: 32px;
  }
`;

const EventCard = styled.div`
  background: rgba(255, 255, 255, 0.02);
  backdrop-filter: blur(20px);
  border-radius: var(--border-radius-lg);
  overflow: hidden;
  box-shadow: var(--box-shadow);
  transition: var(--transition);
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
    transition: transform 0.3s ease;
    z-index: 1;
  }
  
  &:hover {
    transform: translateY(-12px);
    box-shadow: var(--box-shadow-xl);
    
    &::before {
      transform: scaleX(1);
    }
  }
`;

const EventImage = styled.img`
  width: 100%;
  height: 240px;
  object-fit: cover;
  object-position: center;
  transition: var(--transition);
  
  ${EventCard}:hover & {
    transform: scale(1.05);
  }
  
  @media screen and (max-width: 768px) {
    height: 200px;
  }
`;

const EventContent = styled.div`
  padding: 24px;
  
  @media screen and (max-width: 768px) {
    padding: 20px;
  }
`;

const EventTitle = styled.h3`
  color: var(--text-primary);
  margin-bottom: 12px;
  font-weight: 700;
  font-size: 1.3rem;
  line-height: 1.4;
  
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

const TagList = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-top: 12px;
`;

const Tag = styled.span`
  background: var(--gradient-primary);
  color: white;
  padding: 4px 12px;
  border-radius: 16px;
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.02em;
  box-shadow: 0 2px 4px rgba(108, 99, 255, 0.2);
`;

const EventDescription = styled.p`
  color: var(--text-secondary);
  line-height: 1.6;
  margin-bottom: 8px;
  font-size: 0.95rem;
`;

const RsvpCount = styled.div`
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

const Home = () => {
  const navigate = useNavigate();
  const { currentUser } = useContext(AuthContext);
  const [events, setEvents] = useState([]);
  const [filters, setFilters] = useState({ category: '', tags: [] });
  
  useEffect(() => {
    fetchEvents();
  }, [filters]);
  
  const fetchEvents = async () => {
    try {
      const params = new URLSearchParams();
      if (filters.category) params.append('category', filters.category);
      if (filters.tags.length > 0) params.append('tags', filters.tags.join(','));
      
      const response = await api.get(`/events?${params}`);
      setEvents(response.data.events);
    } catch (error) {
      console.error('Failed to fetch events:', error);
    }
  };
  
  const handleFilterChange = useCallback((newFilters) => {
    setFilters(newFilters);
  }, []);
  
  return (
    <>
      <HeroSection>
        <VideoBackground autoPlay muted loop>
          <source src="/videos/background.mp4" type="video/mp4" />
        </VideoBackground>
        <VideoOverlay />
        <HeroContent>
          <div style={{ marginBottom: '40px' }} className="animate-fade-in">
            <Logo size="200px" />
          </div>
          <HeroTitle>
            Plan & Host Amazing <span>Events</span> with Ease
          </HeroTitle>
          <HeroSubtitle>
            EventSphere is your all-in-one platform for creating, managing, and promoting events of any size. From conferences to workshops, we've got you covered.
          </HeroSubtitle>
          <ButtonGroup>
            {!currentUser && <HeroButton to="/register" $primary>Get Started</HeroButton>}
            <HeroButton to="/events">Explore Events</HeroButton>
          </ButtonGroup>
        </HeroContent>
      </HeroSection>
      
      <FeaturesSection>
        <ThemeBackground />
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <SectionTitle>Why Choose <span>EventSphere</span>?</SectionTitle>
          <FeaturesGrid>
            <FeatureCard>
              <FeatureTitle>Easy Event Creation</FeatureTitle>
              <FeatureDescription>
                Create and customize your events in minutes with our intuitive interface. Add details, upload images, and set ticket prices with ease.
              </FeatureDescription>
            </FeatureCard>
            <FeatureCard>
              <FeatureTitle>Powerful Management</FeatureTitle>
              <FeatureDescription>
                Track registrations, send updates, and manage attendees all from one dashboard. Get real-time insights into your event's performance.
              </FeatureDescription>
            </FeatureCard>
            <FeatureCard>
              <FeatureTitle>Seamless Experience</FeatureTitle>
              <FeatureDescription>
                Provide attendees with a smooth registration process, digital tickets, and event updates. Enhance engagement with interactive features.
              </FeatureDescription>
            </FeatureCard>
          </FeaturesGrid>
          
          <SectionTitle style={{ marginTop: '120px' }}>Upcoming <span>Events</span></SectionTitle>
          <EventFilters onFilterChange={handleFilterChange} />
          
          {events.length > 0 ? (
            <EventsGrid>
              {events.slice(0, 6).map(event => (
                <EventCard key={event.id} onClick={() => navigate(`/events/${event.id}`)}>
                  {(event.cover_image || event.event_image) && (
                    <EventImage src={`http://localhost:5000${event.cover_image || event.event_image}`} alt={event.title} />
                  )}
                  <EventContent>
                    <EventTitle>{event.title}</EventTitle>
                    <EventMeta>
                      <span>📅 {new Date(event.date).toLocaleDateString()}</span>
                      <span>📍 {event.location}</span>
                      {event.category_name && <span>🏷️ {event.category_name}</span>}
                    </EventMeta>
                    <EventDescription>
                      {event.description.length > 120 ? `${event.description.substring(0, 120)}...` : event.description}
                    </EventDescription>
                    {event.tags && event.tags.length > 0 && (
                      <TagList>
                        {event.tags.slice(0, 3).map((tag, index) => (
                          <Tag key={index}>{tag}</Tag>
                        ))}
                        {event.tags.length > 3 && <span>+{event.tags.length - 3} more</span>}
                      </TagList>
                    )}
                    <RsvpCount>
                      <span>✓ {event.going_count || 0} Going</span>
                      <span>✗ {event.not_going_count || 0} Not Going</span>
                    </RsvpCount>
                  </EventContent>
                </EventCard>
              ))}
            </EventsGrid>
          ) : (
            <p>No events found matching your filters.</p>
          )}
        </div>
      </FeaturesSection>
    </>
  );
};

export default Home;