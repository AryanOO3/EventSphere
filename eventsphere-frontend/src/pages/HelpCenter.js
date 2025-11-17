import React from 'react';
import styled from 'styled-components';
import ThemeBackground from '../components/ThemeBackground';

const Container = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  padding: 80px 40px;
  min-height: 100vh;
  
  @media screen and (max-width: 768px) {
    padding: 60px 16px;
  }
`;

const PageTitle = styled.h1`
  font-size: 3rem;
  margin-bottom: 48px;
  color: var(--text-primary);
  font-weight: 800;
  text-align: center;
  
  span {
    color: var(--primary);
  }
`;

const Section = styled.div`
  background: rgba(255, 255, 255, 0.02);
  backdrop-filter: blur(20px);
  border-radius: var(--border-radius-lg);
  padding: 32px;
  margin-bottom: 32px;
  border: 1px solid var(--border-color);
  
  h2 {
    color: var(--primary);
    margin-bottom: 16px;
    font-size: 1.5rem;
  }
  
  p {
    color: var(--text-secondary);
    line-height: 1.6;
    margin-bottom: 16px;
  }
  
  ul {
    color: var(--text-secondary);
    line-height: 1.6;
    padding-left: 20px;
  }
`;

const HelpCenter = () => {
  return (
    <>
      <ThemeBackground />
      <Container style={{ position: 'relative', zIndex: 1 }}>
        <PageTitle>Help <span>Center</span></PageTitle>
        
        <Section>
          <h2>Getting Started</h2>
          <p>Welcome to EventSphere! Here's how to get started:</p>
          <ul>
            <li>Create an account or log in</li>
            <li>Browse events in your area</li>
            <li>RSVP to events you're interested in</li>
            <li>Create your own events</li>
            <li>Manage your event attendance</li>
          </ul>
        </Section>

        <Section>
          <h2>Creating Events</h2>
          <p>To create an event:</p>
          <ul>
            <li>Click "Create Event" in the navigation</li>
            <li>Fill in event details (title, description, date, time, location)</li>
            <li>Add a cover image and select categories/tags</li>
            <li>Set RSVP limits if needed</li>
            <li>Publish your event</li>
          </ul>
        </Section>

        <Section>
          <h2>Managing RSVPs</h2>
          <p>Event organizers can:</p>
          <ul>
            <li>View RSVP lists for their events</li>
            <li>Check attendance statistics</li>
            <li>Use QR codes for event check-ins</li>
            <li>Export attendee lists</li>
          </ul>
        </Section>

        <Section>
          <h2>Account Management</h2>
          <p>Manage your account by:</p>
          <ul>
            <li>Updating your profile information</li>
            <li>Uploading a profile picture</li>
            <li>Viewing your event history</li>
            <li>Managing notification preferences</li>
          </ul>
        </Section>
      </Container>
    </>
  );
};

export default HelpCenter;