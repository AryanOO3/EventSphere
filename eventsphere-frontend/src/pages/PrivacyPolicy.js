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

const Content = styled.div`
  background: rgba(255, 255, 255, 0.02);
  backdrop-filter: blur(20px);
  border-radius: var(--border-radius-lg);
  padding: 48px;
  border: 1px solid var(--border-color);
  
  h2 {
    color: var(--primary);
    margin: 32px 0 16px 0;
    font-size: 1.5rem;
    
    &:first-child {
      margin-top: 0;
    }
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
    margin-bottom: 16px;
  }
`;

const LastUpdated = styled.p`
  text-align: center;
  color: var(--text-muted);
  font-style: italic;
  margin-bottom: 32px;
`;

const PrivacyPolicy = () => {
  return (
    <>
      <ThemeBackground />
      <Container style={{ position: 'relative', zIndex: 1 }}>
        <PageTitle>Privacy <span>Policy</span></PageTitle>
        <LastUpdated>Last updated: August 2025</LastUpdated>
        
        <Content>
          <h2>Information We Collect</h2>
          <p>We collect information you provide directly to us, such as:</p>
          <ul>
            <li>Account information (name, email address, password)</li>
            <li>Profile information (profile picture, preferences)</li>
            <li>Event information (events you create, attend, or RSVP to)</li>
            <li>Communication data (messages, feedback, support requests)</li>
          </ul>

          <h2>How We Use Your Information</h2>
          <p>We use the information we collect to:</p>
          <ul>
            <li>Provide, maintain, and improve our services</li>
            <li>Process event registrations and RSVPs</li>
            <li>Send you notifications about events and platform updates</li>
            <li>Respond to your comments, questions, and support requests</li>
            <li>Generate analytics to improve user experience</li>
          </ul>

          <h2>Information Sharing</h2>
          <p>We do not sell, trade, or otherwise transfer your personal information to third parties except:</p>
          <ul>
            <li>With your explicit consent</li>
            <li>To event organizers when you RSVP to their events</li>
            <li>When required by law or to protect our rights</li>
            <li>With service providers who assist in operating our platform</li>
          </ul>

          <h2>Data Security</h2>
          <p>We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the internet is 100% secure.</p>

          <h2>Your Rights</h2>
          <p>You have the right to:</p>
          <ul>
            <li>Access, update, or delete your personal information</li>
            <li>Opt-out of marketing communications</li>
            <li>Request a copy of your data</li>
            <li>Withdraw consent for data processing</li>
          </ul>

          <h2>Cookies and Tracking</h2>
          <p>We use cookies and similar technologies to enhance your experience, analyze usage patterns, and provide personalized content. You can control cookie settings through your browser preferences.</p>

          <h2>Contact Us</h2>
          <p>If you have questions about this Privacy Policy, please contact us at eventsphere003@gmail.com or through our contact form.</p>
        </Content>
      </Container>
    </>
  );
};

export default PrivacyPolicy;