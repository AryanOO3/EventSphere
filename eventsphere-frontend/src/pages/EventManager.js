import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { AuthContext } from '../context/AuthContext';
import ThemeBackground from '../components/ThemeBackground';
import api from '../utils/api';

const Container = styled.div`
  max-width: 1400px;
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

const Section = styled.div`
  background: rgba(255, 255, 255, 0.02);
  backdrop-filter: blur(20px);
  border-radius: var(--border-radius-lg);
  padding: 48px;
  margin-bottom: 32px;
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
    margin-bottom: 24px;
  }
`;

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
  
  @media screen and (max-width: 768px) {
    flex-direction: column;
    gap: 16px;
    align-items: stretch;
  }
`;

const SectionTitle = styled.h2`
  color: var(--text-primary);
  font-size: 2rem;
  font-weight: 700;
  
  span {
    background: var(--gradient-primary);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  
  @media screen and (max-width: 768px) {
    font-size: 1.8rem;
    text-align: center;
  }
`;

const CreateButton = styled(Link)`
  display: inline-block;
  background: var(--gradient-primary);
  color: white;
  padding: 16px 32px;
  border-radius: var(--border-radius);
  text-decoration: none;
  font-weight: 700;
  font-size: 1.1rem;
  transition: var(--transition);
  position: relative;
  overflow: hidden;
  box-shadow: var(--box-shadow-lg);
  outline: none !important;
  
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
    background: linear-gradient(135deg, #8B7FFF 0%, #B490FF 50%, #D8A7FF 100%);
    transform: translateY(-2px);
    box-shadow: var(--box-shadow-xl);
    color: white;
    outline: none !important;
  }
  
  @media screen and (max-width: 768px) {
    padding: 14px 28px;
    font-size: 1rem;
    text-align: center;
  }
`;

const EventsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
  gap: 24px;
  
  @media screen and (max-width: 1200px) {
    grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
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
  padding: 32px;
  box-shadow: var(--box-shadow);
  border: 1px solid var(--border-color);
  transition: var(--transition);
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: var(--gradient-primary);
    transform: scaleX(0);
    transition: transform 0.3s ease;
  }
  
  &:hover {
    transform: translateY(-8px);
    box-shadow: var(--box-shadow-xl);
    
    &::before {
      transform: scaleX(1);
    }
  }
  
  @media screen and (max-width: 768px) {
    padding: 24px;
  }
`;

const EventTitle = styled.h3`
  color: var(--primary);
  margin-bottom: 16px;
  font-size: 1.5rem;
  font-weight: 700;
  line-height: 1.4;
  
  @media screen and (max-width: 768px) {
    font-size: 1.3rem;
  }
`;

const EventMeta = styled.div`
  display: flex;
  gap: 20px;
  margin-bottom: 16px;
  font-size: 0.95rem;
  color: var(--text-secondary);
  flex-wrap: wrap;
  
  span {
    display: flex;
    align-items: center;
    gap: 6px;
    font-weight: 600;
    padding: 4px 8px;
    background: rgba(255, 255, 255, 0.02);
    backdrop-filter: blur(20px);
    border-radius: var(--border-radius);
    border: 1px solid var(--border-color);
  }
  
  @media screen and (max-width: 768px) {
    gap: 12px;
    font-size: 0.9rem;
  }
`;

const EventDescription = styled.p`
  color: var(--text-secondary);
  line-height: 1.6;
  margin-bottom: 20px;
  font-size: 1rem;
`;

const ButtonGroup = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  
  @media screen and (max-width: 768px) {
    gap: 8px;
  }
`;

const Button = styled.button`
  background: var(--gradient-primary);
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: var(--border-radius);
  cursor: pointer;
  font-size: 0.95rem;
  font-weight: 600;
  transition: var(--transition);
  position: relative;
  overflow: hidden;
  box-shadow: var(--box-shadow);
  outline: none !important;
  
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
    background: linear-gradient(135deg, #8B7FFF 0%, #B490FF 50%, #D8A7FF 100%);
    transform: translateY(-2px);
    box-shadow: var(--box-shadow-lg);
    outline: none !important;
  }
  
  &.secondary {
    background: var(--success);
    
    &:hover {
      background: #218838;
    }
  }
  
  &.danger {
    background: linear-gradient(135deg, #dc3545 0%, #c82333 100%);
    
    &:hover {
      background: linear-gradient(135deg, #c82333 0%, #a71e2a 100%);
    }
  }
  
  @media screen and (max-width: 768px) {
    padding: 8px 16px;
    font-size: 0.9rem;
  }
`;

const LinkButton = styled(Link)`
  display: inline-block;
  background: var(--gradient-primary);
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: var(--border-radius);
  text-decoration: none;
  font-size: 0.95rem;
  font-weight: 600;
  transition: var(--transition);
  position: relative;
  overflow: hidden;
  box-shadow: var(--box-shadow);
  outline: none !important;
  
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
    background: linear-gradient(135deg, #8B7FFF 0%, #B490FF 50%, #D8A7FF 100%);
    transform: translateY(-2px);
    box-shadow: var(--box-shadow-lg);
    color: white;
    outline: none !important;
  }
  
  @media screen and (max-width: 768px) {
    padding: 8px 16px;
    font-size: 0.9rem;
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 24px;
  background: rgba(255, 255, 255, 0.02);
  backdrop-filter: blur(20px);
  border-radius: var(--border-radius);
  overflow: hidden;
  box-shadow: var(--box-shadow);
`;

const Th = styled.th`
  text-align: left;
  padding: 16px;
  background: var(--bg-light);
  color: var(--text-primary);
  font-weight: 700;
  font-size: 1rem;
  border-bottom: 2px solid var(--border-color);
  
  @media screen and (max-width: 768px) {
    padding: 12px 8px;
    font-size: 0.9rem;
  }
`;

const Td = styled.td`
  padding: 16px;
  border-bottom: 1px solid var(--border-color);
  color: var(--text-primary);
  
  @media screen and (max-width: 768px) {
    padding: 12px 8px;
    font-size: 0.9rem;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 80px 24px;
  color: var(--text-secondary);
  
  .icon {
    font-size: 4rem;
    margin-bottom: 24px;
    opacity: 0.7;
  }
  
  h3 {
    font-size: 1.5rem;
    color: var(--text-primary);
    margin-bottom: 12px;
    font-weight: 700;
  }
  
  p {
    font-size: 1.1rem;
    font-weight: 500;
  }
`;

const EventManager = () => {
  const { currentUser } = useContext(AuthContext);
  const [myEvents, setMyEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [rsvps, setRsvps] = useState([]);
  const [eventRsvpCounts, setEventRsvpCounts] = useState({});

  useEffect(() => {
    if (currentUser && (currentUser.role === 'admin' || currentUser.role === 'superadmin')) {
      fetchMyEvents();
    }
  }, [currentUser]);

  const fetchMyEvents = async () => {
    try {
      const response = await api.get('/events');
      
      // For superadmin: show all events, for admin: show only their events
      const events = currentUser.role === 'superadmin' 
        ? response.data.events 
        : response.data.events.filter(event => {
            return parseInt(event.organizer_id) === parseInt(currentUser.id);
          });
      
      setMyEvents(events);
      
      // Fetch RSVP counts for all events
      const counts = {};
      for (const event of events) {
        try {
          const rsvpResponse = await api.get(`/events/${event.id}/rsvps`);
          counts[event.id] = rsvpResponse.data.rsvps?.length || 0;
        } catch (error) {
          console.error(`Failed to fetch RSVPs for event ${event.id}:`, error);
          counts[event.id] = 0;
        }
      }
      setEventRsvpCounts(counts);
    } catch (error) {
      console.error('Failed to fetch events:', error);
    }
  };

  const fetchEventRsvps = async (eventId) => {
    try {
      console.log('Fetching RSVPs for event:', eventId);
      const response = await api.get(`/events/${eventId}/rsvps`);
      console.log('RSVP response:', response.data);
      
      if (!response.data.rsvps || response.data.rsvps.length === 0) {
        setRsvps([]);
        setSelectedEvent(eventId);
        return;
      }
      
      // Add check-in status to each RSVP
      const rsvpsWithCheckIn = await Promise.all(
        response.data.rsvps.map(async (rsvp) => {
          try {
            const checkInResponse = await api.get(`/events/${eventId}/rsvp`, {
              headers: { 'user-id': rsvp.user_id }
            });
            return {
              ...rsvp,
              is_checked_in: checkInResponse.data.rsvp?.is_checked_in || false
            };
          } catch {
            return { ...rsvp, is_checked_in: false };
          }
        })
      );
      setRsvps(rsvpsWithCheckIn);
      setSelectedEvent(eventId);
    } catch (error) {
      console.error('Failed to fetch RSVPs:', error);
      alert('Failed to fetch RSVPs. Please try again.');
    }
  };

  const checkInUser = async (eventId, userId) => {
    try {
      await api.post(`/events/${eventId}/checkin/${userId}`);
      fetchEventRsvps(eventId); // Refresh RSVPs
      alert('User checked in successfully!');
    } catch (error) {
      console.error('Failed to check in user:', error);
      alert('Failed to check in user');
    }
  };

  const deleteEvent = async (eventId) => {
    if (window.confirm('Are you sure you want to delete this event? This action cannot be undone.')) {
      try {
        await api.delete(`/events/${eventId}`);
        fetchMyEvents(); // Refresh events list
        alert('Event deleted successfully!');
      } catch (error) {
        console.error('Failed to delete event:', error);
        alert('Failed to delete event');
      }
    }
  };

  const downloadAttendeeList = async (eventId) => {
    try {
      const event = myEvents.find(e => e.id === eventId);
      
      // Fetch fresh RSVP data for this event
      const response = await api.get(`/events/${eventId}/rsvps`);
      const eventRsvps = response.data.rsvps?.filter(r => r.status === 'yes') || [];
      
      if (eventRsvps.length === 0) {
        alert('No attendees to download for this event.');
        return;
      }
      
      const csvContent = [
        ['Name', 'Email', 'RSVP Status', 'RSVP Date'],
        ...eventRsvps.map(rsvp => [
          rsvp.name,
          rsvp.email,
          rsvp.status,
          new Date(rsvp.created_at).toLocaleDateString()
        ])
      ].map(row => row.join(',')).join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${event?.title || 'event'}_attendees.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to download attendee list:', error);
      alert('Failed to download attendee list. Please try again.');
    }
  };

  if (currentUser?.role !== 'admin' && currentUser?.role !== 'superadmin') {
    return <div>Access denied. Admin privileges required.</div>;
  }

  return (
    <>
      <ThemeBackground />
      <Container style={{ position: 'relative', zIndex: 1 }}>
      <PageTitle className="animate-fade-in">Event Manager <span>Dashboard</span></PageTitle>
      
      <Section>
        <SectionHeader>
          <SectionTitle>My <span>Events</span></SectionTitle>
          <CreateButton to="/create-event">
            Create New Event
          </CreateButton>
        </SectionHeader>
        
        {myEvents.length > 0 ? (
          <EventsGrid>
            {myEvents.map(event => (
              <EventCard key={event.id}>
                <EventTitle>{event.title}</EventTitle>
                <EventMeta>
                  <span>📅 {new Date(event.date).toLocaleDateString()}</span>
                  <span>📍 {event.location}</span>
                  <span>👥 RSVPs: {eventRsvpCounts[event.id] || 0}</span>
                </EventMeta>
                <EventDescription>
                  {event.description.length > 120 ? `${event.description.substring(0, 120)}...` : event.description}
                </EventDescription>
                <ButtonGroup>
                  <Button onClick={() => fetchEventRsvps(event.id)}>
                    Manage RSVPs ({eventRsvpCounts[event.id] || 0})
                  </Button>
                  <Button className="secondary" onClick={() => downloadAttendeeList(event.id)}>
                    Download CSV
                  </Button>
                  <LinkButton to={`/events/${event.id}/edit`}>
                    Edit Event
                  </LinkButton>
                  <Button className="danger" onClick={() => deleteEvent(event.id)}>
                    Delete Event
                  </Button>
                </ButtonGroup>
              </EventCard>
            ))}
          </EventsGrid>
        ) : (
          <EmptyState>
            <div className="icon">📅</div>
            <h3>No Events Found</h3>
            <p>You haven't created any events yet. Create your first event to get started!</p>
          </EmptyState>
        )}
      </Section>

      {selectedEvent && (
        <Section>
          <SectionHeader>
            <SectionTitle>RSVP <span>Management</span></SectionTitle>
            <Button 
              className="secondary"
              onClick={() => window.open(`/events/${selectedEvent}/checkins`, '_blank')}
            >
              View Checked-In Users
            </Button>
          </SectionHeader>
          
          {rsvps.length > 0 ? (
            <Table>
              <thead>
                <tr>
                  <Th>Name</Th>
                  <Th>Email</Th>
                  <Th>Status</Th>
                  <Th>RSVP Date</Th>
                  <Th>Actions</Th>
                </tr>
              </thead>
              <tbody>
                {rsvps.map(rsvp => (
                  <tr key={rsvp.id}>
                    <Td>{rsvp.name}</Td>
                    <Td>{rsvp.email}</Td>
                    <Td>{rsvp.status}</Td>
                    <Td>{new Date(rsvp.created_at).toLocaleDateString()}</Td>
                    <Td>
                      {rsvp.status === 'yes' && (
                        rsvp.is_checked_in ? (
                          <Button disabled style={{ opacity: 0.7, background: '#28a745' }}>
                            ✓ Checked In
                          </Button>
                        ) : (
                          <Button onClick={() => checkInUser(selectedEvent, rsvp.user_id)}>
                            Check In
                          </Button>
                        )
                      )}
                    </Td>
                  </tr>
                ))}
              </tbody>
            </Table>
          ) : (
            <EmptyState>
              <div className="icon">👥</div>
              <h3>No RSVPs Yet</h3>
              <p>No one has RSVP'd to this event yet.</p>
            </EmptyState>
          )}
        </Section>
      )}
      </Container>
    </>
  );
};

export default EventManager;