import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { AuthContext } from '../context/AuthContext';
import ThemeBackground from '../components/ThemeBackground';
import api from '../utils/api';

const AdminWrapper = styled.div`
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

const HeaderCard = styled.div`
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

const AdminTitle = styled.h1`
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

const MetricsGrid = styled.div`
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

const MetricCard = styled.div`
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

const MetricValue = styled.h2`
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

const MetricLabel = styled.p`
  color: var(--text-secondary);
  font-weight: 600;
  font-size: 1.1rem;
  
  @media screen and (max-width: 768px) {
    font-size: 1rem;
  }
`;

const ActionsPanel = styled.div`
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
    border-radius: var(--border-radius-lg) var(--border-radius-lg) 0 0;
  }
  
  @media screen and (max-width: 768px) {
    padding: 32px 24px;
  }
`;

const ActionsLayout = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 24px;
  margin-top: 32px;
  
  @media screen and (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 16px;
  }
`;

const ActionLink = styled(Link)`
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
    
    h3 {
      color: white;
      background: none;
      -webkit-text-fill-color: white;
    }
    
    p {
      color: rgba(255, 255, 255, 0.9);
    }
  }
  
  h3 {
    background: var(--gradient-primary);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    margin-bottom: 12px;
    font-size: 1.3rem;
    font-weight: 700;
  }
  
  p {
    color: var(--text-secondary);
    font-size: 1rem;
    line-height: 1.5;
  }
  
  @media screen and (max-width: 768px) {
    padding: 24px 20px;
    
    h3 {
      font-size: 1.2rem;
    }
    
    p {
      font-size: 0.95rem;
    }
  }
`;

const SuperAdminDashboard = () => {
  const { currentUser } = useContext(AuthContext);
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeEvents: 0,
    completedEvents: 0,
    totalCategories: 0
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [adminStatsRes, categoriesRes, tagsRes] = await Promise.all([
        api.get('/admin/stats'),
        api.get('/categories').catch(() => ({ data: { categories: [] } })),
        api.get('/tags').catch(() => ({ data: { tags: [] } }))
      ]);
      
      setStats({
        totalUsers: adminStatsRes.data.stats.totalUsers || 0,
        activeEvents: adminStatsRes.data.stats.activeEvents || 0,
        completedEvents: adminStatsRes.data.stats.completedEvents || 0,
        totalCategories: categoriesRes.data.categories?.length || 0
      });
    } catch (error) {
      console.error('Failed to fetch stats:', error);
      setStats({ totalUsers: 0, activeEvents: 0, completedEvents: 0, totalCategories: 0 });
    }
  };

  return (
    <>
      <ThemeBackground />
      <AdminWrapper style={{ position: 'relative', zIndex: 1 }}>
        <HeaderCard>
          <AdminTitle>
            Super Admin Dashboard - <span>{currentUser?.name}</span>
          </AdminTitle>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>
            Complete system overview and management
          </p>
        </HeaderCard>

        <MetricsGrid>
          <MetricCard>
            <MetricValue>{stats.totalUsers}</MetricValue>
            <MetricLabel>Total Users</MetricLabel>
          </MetricCard>
          <MetricCard>
            <MetricValue>{stats.activeEvents}</MetricValue>
            <MetricLabel>Active Events</MetricLabel>
          </MetricCard>
          <MetricCard>
            <MetricValue>{stats.completedEvents}</MetricValue>
            <MetricLabel>Completed Events</MetricLabel>
          </MetricCard>
          <MetricCard>
            <MetricValue>{stats.totalCategories}</MetricValue>
            <MetricLabel>Categories</MetricLabel>
          </MetricCard>
        </MetricsGrid>

        <ActionsPanel>
          <AdminTitle>Quick Actions</AdminTitle>
          <ActionsLayout>
            <ActionLink to="/superadmin">
              <h3>Super Admin Panel</h3>
              <p>Access comprehensive admin controls and system management</p>
            </ActionLink>
            <ActionLink to="/event-manager">
              <h3>Event Management</h3>
              <p>Oversee all events across the platform</p>
            </ActionLink>
            <ActionLink to="/superadmin/categories">
              <h3>Categories & Tags</h3>
              <p>Manage event categories and tags</p>
            </ActionLink>
            <ActionLink to="/qr-scanner">
              <h3>QR Scanner</h3>
              <p>Check-in attendees at events</p>
            </ActionLink>
            <ActionLink to="/create-event">
              <h3>Create Event</h3>
              <p>Create new events for the platform</p>
            </ActionLink>
            <ActionLink to="/profile">
              <h3>Profile Settings</h3>
              <p>Manage your account settings</p>
            </ActionLink>
          </ActionsLayout>
        </ActionsPanel>
      </AdminWrapper>
    </>
  );
};

export default SuperAdminDashboard;