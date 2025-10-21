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

const TermsOfService = () => {
  return (
    <>
      <ThemeBackground />
      <Container style={{ position: 'relative', zIndex: 1 }}>
        <PageTitle>Terms of <span>Service</span></PageTitle>
        <LastUpdated>Last updated: August 2025</LastUpdated>
        
        <Content>
          <h2>Acceptance of Terms</h2>
          <p>By accessing and using EventSphere, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.</p>

          <h2>Use License</h2>
          <p>Permission is granted to temporarily use EventSphere for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:</p>
          <ul>
            <li>Modify or copy the materials</li>
            <li>Use the materials for any commercial purpose or for any public display</li>
            <li>Attempt to reverse engineer any software contained on the platform</li>
            <li>Remove any copyright or other proprietary notations from the materials</li>
          </ul>

          <h2>User Accounts</h2>
          <p>When you create an account with us, you must provide information that is accurate, complete, and current at all times. You are responsible for safeguarding the password and for all activities that occur under your account.</p>

          <h2>Event Creation and Management</h2>
          <p>As an event organizer, you are responsible for:</p>
          <ul>
            <li>Providing accurate event information</li>
            <li>Ensuring events comply with local laws and regulations</li>
            <li>Managing attendee communications professionally</li>
            <li>Respecting attendee privacy and data</li>
          </ul>

          <h2>Prohibited Uses</h2>
          <p>You may not use our service:</p>
          <ul>
            <li>For any unlawful purpose or to solicit others to perform unlawful acts</li>
            <li>To violate any international, federal, provincial, or state regulations, rules, laws, or local ordinances</li>
            <li>To infringe upon or violate our intellectual property rights or the intellectual property rights of others</li>
            <li>To harass, abuse, insult, harm, defame, slander, disparage, intimidate, or discriminate</li>
            <li>To submit false or misleading information</li>
          </ul>

          <h2>Content</h2>
          <p>Our service allows you to post, link, store, share and otherwise make available certain information, text, graphics, videos, or other material. You are responsible for the content that you post to the service.</p>

          <h2>Termination</h2>
          <p>We may terminate or suspend your account immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.</p>

          <h2>Disclaimer</h2>
          <p>The information on this platform is provided on an 'as is' basis. To the fullest extent permitted by law, EventSphere excludes all representations, warranties, conditions and terms.</p>

          <h2>Limitation of Liability</h2>
          <p>In no event shall EventSphere, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential, or punitive damages.</p>

          <h2>Contact Information</h2>
          <p>If you have any questions about these Terms of Service, please contact us at eventsphere003@gmail.com.</p>
        </Content>
      </Container>
    </>
  );
};

export default TermsOfService;