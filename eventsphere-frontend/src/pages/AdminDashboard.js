import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import { AuthContext } from '../context/AuthContext';
import ThemeBackground from '../components/ThemeBackground';
import api from '../utils/api';

const DashboardContainer = styled.div`
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
  box-shadow: var(--box-shadow-xl);
  border: 1px solid var(--border-color);
  position: relative;
  overflow: hidden;
  text-align: center;
  
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
    margin-bottom: 32px;
  }
`;

const WelcomeTitle = styled.h1`
  font-size: 3rem;
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
  
  @media screen and (max-width: 1024px) {
    font-size: 2.5rem;
  }
  
  @media screen and (max-width: 768px) {
    font-size: 2rem;
  }
`;

const WelcomeSubtitle = styled.p`
  color: var(--text-secondary);
  font-size: 1.2rem;
  font-weight: 500;
  
  @media screen and (max-width: 768px) {
    font-size: 1.1rem;
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
  margin-bottom: 48px;
  
  @media screen and (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
  }
  
  @media screen and (max-width: 640px) {
    grid-template-columns: 1fr;
    gap: 16px;
  }
`;

const StatCard = styled.div`
  background: rgba(255, 255, 255, 0.02);
  backdrop-filter: blur(20px);
  padding: 32px;
  border-radius: var(--border-radius-lg);
  box-shadow: var(--box-shadow-lg);
  text-align: center;
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
  letter-spacing: 0.02em;
  
  @media screen and (max-width: 768px) {
    font-size: 1rem;
  }
`;

const ChartsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 32px;
  margin-bottom: 48px;
  
  @media screen and (max-width: 1024px) {
    gap: 24px;
  }
  
  @media screen and (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 20px;
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
  }
  
  @media screen and (max-width: 768px) {
    padding: 24px;
  }
`;

const ChartTitle = styled.h3`
  margin-bottom: 24px;
  color: var(--text-primary);
  font-size: 1.5rem;
  font-weight: 700;
  
  @media screen and (max-width: 768px) {
    font-size: 1.3rem;
    margin-bottom: 20px;
  }
`;

const QuickActions = styled.div`
  background: rgba(255, 255, 255, 0.02);
  backdrop-filter: blur(20px);
  border-radius: var(--border-radius-lg);
  padding: 48px;
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
  }
  
  @media screen and (max-width: 768px) {
    padding: 32px 24px;
  }
`;

const ActionsTitle = styled.h2`
  font-size: 2rem;
  color: var(--text-primary);
  margin-bottom: 32px;
  font-weight: 700;
  text-align: center;
  
  span {
    background: var(--gradient-primary);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  
  @media screen and (max-width: 768px) {
    font-size: 1.8rem;
    margin-bottom: 24px;
  }
`;

const ActionsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
  
  @media screen and (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
  }
  
  @media screen and (max-width: 640px) {
    grid-template-columns: 1fr;
    gap: 16px;
  }
`;

const ActionCard = styled(Link)`
  display: block;
  background: var(--bg-light);
  padding: 24px;
  border-radius: var(--border-radius);
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
    bottom: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: var(--gradient-primary);
    transform: scaleX(0);
    transition: transform 0.3s ease;
  }
  
  &:hover {
    transform: translateY(-6px);
    box-shadow: var(--box-shadow-xl);
    background: var(--bg-white);
    
    &::before {
      transform: scaleX(1);
    }
    
    h3 {
      background: var(--gradient-primary);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
  }
  
  h3 {
    color: var(--primary);
    margin-bottom: 12px;
    font-size: 1.3rem;
    font-weight: 700;
    transition: var(--transition);
  }
  
  p {
    color: var(--text-secondary);
    font-size: 0.95rem;
    line-height: 1.6;
    font-weight: 500;
  }
  
  @media screen and (max-width: 768px) {
    padding: 20px;
    
    h3 {
      font-size: 1.2rem;
    }
    
    p {
      font-size: 0.9rem;
    }
  }
`;

const AdminDashboard = () => {
  const { currentUser } = useContext(AuthContext);
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeEvents: 0,
    totalRsvps: 0,
    goingCount: 0
  });

  useEffect(() => {
    if (currentUser?.role === 'admin' || currentUser?.role === 'superadmin') {
      fetchStats();
    }
  }, [currentUser]);

  const fetchStats = async () => {
    try {
      const response = await api.get('/admin/stats');
      setStats({
        totalUsers: response.data.stats.totalUsers || 0,
        activeEvents: response.data.stats.activeEvents || 0,
        totalRsvps: response.data.stats.totalRsvps || 0,
        goingCount: response.data.stats.goingCount || 0
      });
    } catch (error) {
      console.error('Failed to fetch stats:', error);
      setStats({ totalUsers: 0, activeEvents: 0, totalRsvps: 0, goingCount: 0 });
    }
  };

  if (currentUser?.role !== 'admin' && currentUser?.role !== 'superadmin') {
    return <div>Access denied. Admin privileges required.</div>;
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
      <DashboardContainer style={{ position: 'relative', zIndex: 1 }}>
      <WelcomeSection className="animate-fade-in">
        <WelcomeTitle>
          Admin <span>Dashboard</span>
        </WelcomeTitle>
        <WelcomeSubtitle>
          Welcome back, {currentUser?.name}! Platform management and analytics overview
        </WelcomeSubtitle>
      </WelcomeSection>
      
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
        <ActionsTitle>Quick <span>Actions</span></ActionsTitle>
        <ActionsGrid>
          <ActionCard to="/create-event">
            <h3>Create Event</h3>
            <p>Create new events for the platform</p>
          </ActionCard>
          <ActionCard to="/qr-scanner">
            <h3>QR Scanner</h3>
            <p>Check-in attendees at events</p>
          </ActionCard>
          <ActionCard to="/admin">
            <h3>Categories & Tags</h3>
            <p>Manage event categories and tags</p>
          </ActionCard>
          <ActionCard to="/events">
            <h3>Browse Events</h3>
            <p>Discover and RSVP to events</p>
          </ActionCard>
          <ActionCard to="/calendar">
            <h3>Event Calendar</h3>
            <p>View events in calendar format</p>
          </ActionCard>
          <ActionCard to="/profile">
            <h3>Profile Settings</h3>
            <p>Manage your account and preferences</p>
          </ActionCard>
        </ActionsGrid>
      </QuickActions>
      </DashboardContainer>
    </>
  );
};

export default AdminDashboard;