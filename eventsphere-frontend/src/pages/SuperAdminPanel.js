import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from 'recharts';
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

const Section = styled.div`
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

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  
  @media screen and (max-width: 768px) {
    font-size: 0.9rem;
  }
  
  @media screen and (max-width: 480px) {
    font-size: 0.8rem;
  }
`;

const Th = styled.th`
  text-align: left;
  padding: 12px;
  border-bottom: 2px solid #ddd;
  background-color: var(--bg-light);
  
  @media screen and (max-width: 768px) {
    padding: 8px 6px;
  }
`;

const Td = styled.td`
  padding: 12px;
  border-bottom: 1px solid #ddd;
  
  @media screen and (max-width: 768px) {
    padding: 8px 6px;
  }
`;

const Button = styled.button`
  background: ${props => props.danger ? '#dc3545' : 'var(--gradient-primary)'};
  color: white;
  border: none;
  padding: 10px 16px;
  border-radius: var(--border-radius);
  cursor: pointer;
  margin-right: 8px;
  margin-bottom: 8px;
  font-size: 0.9rem;
  font-weight: 600;
  transition: var(--transition);
  position: relative;
  overflow: hidden;
  outline: none;
  
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
    transform: translateY(-2px) ${props => props.danger ? 'scale(1.05)' : ''};
    box-shadow: ${props => props.danger ? '0 8px 25px rgba(220, 53, 69, 0.4)' : 'var(--box-shadow-lg)'};
    background: ${props => props.danger ? '#c82333' : 'var(--gradient-primary)'} !important;
  }
`;

const Select = styled.select`
  padding: 6px;
  border: 1px solid #ddd;
  border-radius: var(--border-radius);
`;

const ActivityItem = styled.div`
  padding: 16px;
  border-bottom: 1px solid var(--border-color);
  font-size: 1rem;
  transition: var(--transition);
  
  &:hover {
    background: var(--bg-light);
  }
  
  &:last-child {
    border-bottom: none;
  }
  
  @media screen and (max-width: 768px) {
    padding: 12px;
    font-size: 0.9rem;
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
  
  h3 {
    background: var(--gradient-primary);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    font-size: 2rem;
    font-weight: 700;
    margin-bottom: 32px;
    
    @media screen and (max-width: 768px) {
      font-size: 1.6rem;
    }
  }
  
  @media screen and (max-width: 768px) {
    padding: 32px 24px;
    margin-bottom: 32px;
  }
`;

const ActionButton = styled(Link)`
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
  margin-bottom: 24px;
  
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
  padding: 32px 24px;
  border-radius: var(--border-radius-lg);
  box-shadow: var(--box-shadow-lg);
  border: 1px solid var(--border-color);
  text-align: center;
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
  font-weight: 500;
`;

const ChartsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 30px;
  margin-bottom: 48px;
  
  @media screen and (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 24px;
    margin-bottom: 32px;
  }
`;

const ChartCard = styled.div`
  background: rgba(255, 255, 255, 0.02);
  backdrop-filter: blur(20px);
  padding: 32px;
  border-radius: var(--border-radius-lg);
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
    padding: 24px 20px;
  }
`;

const ChartTitle = styled.h3`
  background: var(--gradient-primary);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 24px;
  font-size: 1.5rem;
  font-weight: 700;
  
  @media screen and (max-width: 768px) {
    font-size: 1.3rem;
    margin-bottom: 20px;
  }
`;

const SuperAdminPanel = () => {
  const { currentUser } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [events, setEvents] = useState([]);
  const [activities, setActivities] = useState([]);
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeEvents: 0,
    totalRsvps: 0,
    goingCount: 0
  });
  const [activeTab, setActiveTab] = useState('dashboard');

  useEffect(() => {
    if (currentUser?.role === 'superadmin') {
      fetchStats();
      fetchUsers();
      fetchEvents();
      fetchActivities();
    }
  }, [currentUser]);

  const fetchStats = async () => {
    try {
      const response = await api.get('/admin/stats');
      setStats(response.data.stats);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  };

  const fetchUsers = async () => {
    try {
      console.log('Fetching users...');
      const response = await api.get('/admin/users');
      console.log('Users response:', response.data);
      setUsers(response.data.users || []);
    } catch (error) {
      console.error('Failed to fetch users:', error);
      console.error('Error details:', error.response?.data);
    }
  };

  const fetchEvents = async () => {
    try {
      const response = await api.get('/admin/events');
      setEvents(response.data.events);
    } catch (error) {
      console.error('Failed to fetch events:', error);
    }
  };

  const fetchActivities = async () => {
    try {
      const response = await api.get('/admin/activities');
      setActivities(response.data.activities);
    } catch (error) {
      console.error('Failed to fetch activities:', error);
    }
  };

  const updateUserRole = async (userId, newRole) => {
    try {
      await api.put(`/admin/users/${userId}/role`, { role: newRole });
      fetchUsers();
    } catch (error) {
      console.error('Failed to update user role:', error);
    }
  };

  const toggleUserBlock = async (userId, isBlocked) => {
    try {
      await api.put(`/admin/users/${userId}/block`, { is_blocked: !isBlocked });
      fetchUsers();
    } catch (error) {
      console.error('Failed to toggle user block:', error);
    }
  };

  const toggleEventStatus = async (eventId, isPublished) => {
    try {
      await api.put(`/admin/events/${eventId}/status`, { is_published: !isPublished });
      fetchEvents();
    } catch (error) {
      console.error('Failed to toggle event status:', error);
    }
  };

  const deleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await api.delete(`/admin/users/${userId}`);
        fetchUsers();
      } catch (error) {
        console.error('Failed to delete user:', error);
      }
    }
  };

  const deleteEvent = async (eventId) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        await api.delete(`/events/${eventId}`);
        fetchEvents();
      } catch (error) {
        console.error('Failed to delete event:', error);
      }
    }
  };

  if (currentUser?.role !== 'superadmin') {
    return <div>Access denied. Super Admin privileges required.</div>;
  }

  const rsvpData = [
    { name: 'Going', value: stats.goingCount, color: '#9B95FF' },
    { name: 'Not Going', value: stats.totalRsvps - stats.goingCount, color: '#E0A8FF' }
  ];

  const overviewData = [
    { name: 'Users', value: stats.totalUsers },
    { name: 'Events', value: stats.activeEvents },
    { name: 'RSVPs', value: stats.totalRsvps }
  ];

  return (
    <>
      <ThemeBackground />
      <Container style={{ position: 'relative', zIndex: 1 }}>
      <h1>Super Admin Panel</h1>
      
      <div style={{ marginBottom: '20px' }}>
        <Button onClick={() => setActiveTab('dashboard')} style={{ backgroundColor: activeTab === 'dashboard' ? 'var(--primary)' : '#ccc' }}>
          Dashboard
        </Button>
        <Button onClick={() => setActiveTab('users')} style={{ backgroundColor: activeTab === 'users' ? 'var(--primary)' : '#ccc' }}>
          Users
        </Button>
        <Button onClick={() => setActiveTab('events')} style={{ backgroundColor: activeTab === 'events' ? 'var(--primary)' : '#ccc' }}>
          Events
        </Button>
        <Button onClick={() => setActiveTab('activities')} style={{ backgroundColor: activeTab === 'activities' ? 'var(--primary)' : '#ccc' }}>
          Activities
        </Button>
      </div>

      {activeTab === 'dashboard' && (
        <>
          <StatsGrid>
            <StatCard>
              <StatNumber>{stats.totalUsers}</StatNumber>
              <StatLabel>Total Users</StatLabel>
            </StatCard>
            <StatCard>
              <StatNumber>{stats.activeEvents}</StatNumber>
              <StatLabel>Active Events</StatLabel>
            </StatCard>
            <StatCard>
              <StatNumber>{stats.totalRsvps}</StatNumber>
              <StatLabel>Total RSVPs</StatLabel>
            </StatCard>
            <StatCard>
              <StatNumber>{stats.goingCount}</StatNumber>
              <StatLabel>Going Count</StatLabel>
            </StatCard>
          </StatsGrid>

          <ChartsGrid>
            <ChartCard>
              <ChartTitle>RSVP Distribution</ChartTitle>
              <ResponsiveContainer width="100%" height={320}>
                <PieChart>
                  <defs>
                    <linearGradient id="goingGradient" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="#9B95FF" />
                      <stop offset="100%" stopColor="#C490FF" />
                    </linearGradient>
                    <linearGradient id="notGoingGradient" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="#E0A8FF" />
                      <stop offset="100%" stopColor="#F0C8FF" />
                    </linearGradient>
                  </defs>
                  <Pie
                    data={rsvpData}
                    cx="50%"
                    cy="50%"
                    outerRadius={120}
                    innerRadius={50}
                    dataKey="value"
                    stroke="#fff"
                    strokeWidth={3}
                  >
                    <Cell fill="url(#goingGradient)" />
                    <Cell fill="url(#notGoingGradient)" />
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '16px', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <div style={{ width: '16px', height: '16px', background: 'linear-gradient(135deg, #9B95FF, #C490FF)', borderRadius: '50%' }}></div>
                  <span style={{ fontSize: '0.9rem', fontWeight: '600' }}>Going ({stats.goingCount})</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: '16px', height: '16px', background: 'linear-gradient(135deg, #E0A8FF, #F0C8FF)', borderRadius: '50%' }}></div>
                  <span style={{ fontSize: '0.9rem', fontWeight: '600' }}>Not Going ({stats.totalRsvps - stats.goingCount})</span>
                </div>
              </div>
            </ChartCard>

            <ChartCard>
              <ChartTitle>Platform Overview</ChartTitle>
              <ResponsiveContainer width="100%" height={320}>
                <BarChart data={overviewData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                  <defs>
                    <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#9B95FF" />
                      <stop offset="50%" stopColor="#C490FF" />
                      <stop offset="100%" stopColor="#E0A8FF" />
                    </linearGradient>
                  </defs>
                  <XAxis 
                    dataKey="name" 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fontWeight: 600, fill: '#6B7280' }}
                  />
                  <YAxis 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fontWeight: 600, fill: '#6B7280' }}
                    grid={false}
                  />
                  <Bar 
                    dataKey="value" 
                    fill="url(#barGradient)" 
                    radius={[8, 8, 0, 0]}
                    stroke="#fff"
                    strokeWidth={2}
                  />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>
          </ChartsGrid>

          <QuickActions>
            <h3>Quick Actions</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px', marginTop: '32px' }}>
              <ActionButton to="/qr-scanner">
                <div className="action-title">📱 QR Code Scanner</div>
                <div className="action-desc">Check-in attendees at events</div>
              </ActionButton>
              <ActionButton to="/create-event">
                <div className="action-title">Create Event</div>
                <div className="action-desc">Create new events for the platform</div>
              </ActionButton>
              <ActionButton to="/event-manager">
                <div className="action-title">Event Manager</div>
                <div className="action-desc">Oversee all events across the platform</div>
              </ActionButton>
              <ActionButton to="/superadmin/categories">
                <div className="action-title">Categories & Tags</div>
                <div className="action-desc">Manage event categories and tags</div>
              </ActionButton>
              <ActionButton to="/superadmin/dashboard">
                <div className="action-title">SuperAdmin Dashboard</div>
                <div className="action-desc">View comprehensive system analytics</div>
              </ActionButton>
              <ActionButton to="/profile">
                <div className="action-title">Profile Settings</div>
                <div className="action-desc">Manage your account settings</div>
              </ActionButton>
            </div>
          </QuickActions>
        </>
      )}

      {activeTab === 'users' && (
        <Section>
          <SectionTitle>User Management & Admin Promotion</SectionTitle>
          <div style={{ marginBottom: '20px', padding: '15px', backgroundColor: 'var(--bg-light)', borderRadius: 'var(--border-radius)' }}>
            <strong>Admin Users:</strong> {users.filter(u => u.role === 'admin').length} | 
            <strong> Super Admins:</strong> {users.filter(u => u.role === 'superadmin').length} | 
            <strong> Regular Users:</strong> {users.filter(u => u.role === 'user').length}
          </div>
          <Table>
            <thead>
              <tr>
                <Th>Name</Th>
                <Th>Email</Th>
                <Th>Role</Th>
                <Th>Status</Th>
                <Th>Joined</Th>
                <Th>Actions</Th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.id}>
                  <Td>{user.name}</Td>
                  <Td>{user.email}</Td>
                  <Td>
                    <Select 
                      value={user.role} 
                      onChange={(e) => updateUserRole(user.id, e.target.value)}
                      style={{ 
                        backgroundColor: user.role === 'superadmin' ? '#dc3545' : user.role === 'admin' ? '#ffc107' : '#28a745',
                        color: 'white',
                        fontWeight: 'bold'
                      }}
                    >
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                      <option value="superadmin">Super Admin</option>
                    </Select>
                  </Td>
                  <Td>
                    <span style={{ 
                      color: user.is_blocked ? '#dc3545' : '#28a745',
                      fontWeight: 'bold'
                    }}>
                      {user.is_blocked ? 'Blocked' : 'Active'}
                    </span>
                  </Td>
                  <Td>{user.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}</Td>
                  <Td>
                    {user.id !== currentUser.id && (
                      <Button onClick={() => toggleUserBlock(user.id, user.is_blocked)}>
                        {user.is_blocked ? 'Unblock' : 'Block'}
                      </Button>
                    )}
                    {user.id !== currentUser.id && (
                      <Button danger onClick={() => deleteUser(user.id)}>
                        Delete
                      </Button>
                    )}
                  </Td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Section>
      )}

      {activeTab === 'events' && (
        <Section>
          <SectionTitle>Event Management</SectionTitle>
          <Table>
            <thead>
              <tr>
                <Th>Title</Th>
                <Th>Organizer</Th>
                <Th>Category</Th>
                <Th>Status</Th>
                <Th>Actions</Th>
              </tr>
            </thead>
            <tbody>
              {events.map(event => (
                <tr key={event.id}>
                  <Td>{event.title}</Td>
                  <Td>{event.organizer_name}</Td>
                  <Td>{event.category_name || 'None'}</Td>
                  <Td>{event.is_published ? 'Published' : 'Draft'}</Td>
                  <Td>
                    <Button onClick={() => toggleEventStatus(event.id, event.is_published)}>
                      {event.is_published ? 'Unpublish' : 'Publish'}
                    </Button>
                    <Button onClick={() => window.open(`/events/${event.id}/edit`, '_blank')}>
                      Edit
                    </Button>
                    <Button danger onClick={() => deleteEvent(event.id)}>
                      Delete
                    </Button>
                  </Td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Section>
      )}

      {activeTab === 'activities' && (
        <Section>
          <SectionTitle>Platform Activities</SectionTitle>
          <div style={{ maxHeight: '600px', overflowY: 'auto', border: '1px solid var(--border-color)', borderRadius: 'var(--border-radius)' }}>
            {activities.length > 0 ? activities.map((activity, index) => (
              <ActivityItem key={index}>
                <div>
                  {activity.activity_type === 'rsvp' ? (
                    <span>
                      📝 <strong style={{ color: 'var(--primary)' }}>{activity.user_name}</strong> RSVPed "{activity.status}" to <strong>{activity.event_title}</strong>
                    </span>
                  ) : activity.activity_type === 'category_created' ? (
                    <span>
                      🏷️ <strong style={{ color: 'var(--primary)' }}>{activity.user_name}</strong> {activity.description}
                    </span>
                  ) : activity.activity_type === 'category_deleted' ? (
                    <span>
                      🗑️ <strong style={{ color: 'var(--primary)' }}>{activity.user_name}</strong> {activity.description}
                    </span>
                  ) : activity.activity_type === 'tag_created' ? (
                    <span>
                      🏷️ <strong style={{ color: 'var(--primary)' }}>{activity.user_name}</strong> {activity.description}
                    </span>
                  ) : activity.activity_type === 'tag_deleted' ? (
                    <span>
                      🗑️ <strong style={{ color: 'var(--primary)' }}>{activity.user_name}</strong> {activity.description}
                    </span>
                  ) : activity.activity_type === 'event_created' ? (
                    <span>
                      📅 <strong style={{ color: 'var(--primary)' }}>{activity.user_name}</strong> {activity.description}
                    </span>
                  ) : activity.activity_type === 'event_updated' ? (
                    <span>
                      ✏️ <strong style={{ color: 'var(--primary)' }}>{activity.user_name}</strong> {activity.description}
                    </span>
                  ) : activity.activity_type === 'event_deleted' ? (
                    <span>
                      🗑️ <strong style={{ color: 'var(--primary)' }}>{activity.user_name}</strong> {activity.description}
                    </span>
                  ) : (
                    <span>
                      👤 <strong style={{ color: 'var(--primary)' }}>{activity.name || activity.user_name}</strong> {activity.role ? `registered as ${activity.role}` : 'performed an action'}
                    </span>
                  )}
                </div>
                <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '4px' }}>
                  {new Date(activity.created_at).toLocaleString()}
                </div>
              </ActivityItem>
            )) : (
              <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>
                No activities found
              </div>
            )}
          </div>
        </Section>
      )}
      </Container>
    </>
  );
};

export default SuperAdminPanel;