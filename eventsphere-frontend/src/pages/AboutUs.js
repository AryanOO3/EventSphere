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
  padding: 48px;
  margin-bottom: 32px;
  border: 1px solid var(--border-color);
  
  h2 {
    color: var(--primary);
    margin-bottom: 24px;
    font-size: 1.8rem;
  }
  
  p {
    color: var(--text-secondary);
    line-height: 1.6;
    margin-bottom: 16px;
    font-size: 1.1rem;
  }
  
  ul {
    color: var(--text-secondary);
    line-height: 1.6;
    padding-left: 20px;
    margin-bottom: 16px;
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 24px;
  margin: 32px 0;
`;

const StatCard = styled.div`
  background: var(--primary);
  color: white;
  padding: 32px 24px;
  border-radius: var(--border-radius-lg);
  text-align: center;
  
  h3 {
    font-size: 2.5rem;
    font-weight: 800;
    margin-bottom: 8px;
  }
  
  p {
    font-size: 1rem;
    font-weight: 600;
    opacity: 0.9;
  }
`;

const TeamGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 24px;
  margin-top: 32px;
`;

const TeamMember = styled.div`
  background: rgba(255, 255, 255, 0.02);
  backdrop-filter: blur(20px);
  border-radius: var(--border-radius-lg);
  padding: 32px 24px;
  text-align: center;
  border: 1px solid var(--border-color);
  
  .avatar {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    background: var(--primary);
    margin: 0 auto 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 2rem;
    color: white;
  }
  
  h4 {
    color: var(--text-primary);
    margin-bottom: 8px;
    font-size: 1.2rem;
  }
  
  .role {
    color: var(--primary);
    font-weight: 600;
    margin-bottom: 12px;
  }
  
  p {
    color: var(--text-secondary);
    font-size: 0.9rem;
    line-height: 1.5;
  }
`;

const AboutUs = () => {
  return (
    <>
      <ThemeBackground />
      <Container style={{ position: 'relative', zIndex: 1 }}>
        <PageTitle>About <span>EventSphere</span></PageTitle>
        
        <Section>
          <h2>Our Mission</h2>
          <p>
            EventSphere is dedicated to connecting communities through amazing events. We believe that great experiences 
            bring people together, foster relationships, and create lasting memories. Our platform makes it easy for 
            anyone to discover, create, and manage events that matter to them.
          </p>
          <p>
            Whether you're organizing a small meetup, a corporate conference, or a large festival, EventSphere provides 
            the tools and features you need to make your event successful.
          </p>
        </Section>

        <Section>
          <h2>Platform Statistics</h2>
          <StatsGrid>
            <StatCard>
              <h3>10K+</h3>
              <p>Events Created</p>
            </StatCard>
            <StatCard>
              <h3>50K+</h3>
              <p>Active Users</p>
            </StatCard>
            <StatCard>
              <h3>100K+</h3>
              <p>Event Attendees</p>
            </StatCard>
            <StatCard>
              <h3>500+</h3>
              <p>Cities Worldwide</p>
            </StatCard>
          </StatsGrid>
        </Section>

        <Section>
          <h2>What We Offer</h2>
          <ul>
            <li><strong>Easy Event Creation:</strong> Intuitive tools to create and customize your events</li>
            <li><strong>Smart Discovery:</strong> Find events that match your interests and location</li>
            <li><strong>RSVP Management:</strong> Seamless registration and attendance tracking</li>
            <li><strong>QR Code Check-ins:</strong> Modern, contactless event check-in system</li>
            <li><strong>Real-time Analytics:</strong> Comprehensive insights for event organizers</li>
            <li><strong>Community Building:</strong> Connect with like-minded people in your area</li>
          </ul>
        </Section>

        <Section>
          <h2>Our Team</h2>
          <p>EventSphere is built by a passionate team of developers, designers, and event enthusiasts who understand the importance of bringing people together.</p>
          
          <TeamGrid>
            <TeamMember>
              <div className="avatar">👨‍💻</div>
              <h4>Development Team</h4>
              <div className="role">Full-Stack Engineers</div>
              <p>Building robust, scalable solutions for event management and community engagement.</p>
            </TeamMember>
            
            <TeamMember>
              <div className="avatar">🎨</div>
              <h4>Design Team</h4>
              <div className="role">UX/UI Designers</div>
              <p>Creating beautiful, intuitive experiences that make event management effortless.</p>
            </TeamMember>
            
            <TeamMember>
              <div className="avatar">📊</div>
              <h4>Product Team</h4>
              <div className="role">Product Managers</div>
              <p>Ensuring our platform meets the evolving needs of event organizers and attendees.</p>
            </TeamMember>
          </TeamGrid>
        </Section>

        <Section>
          <h2>Our Values</h2>
          <ul>
            <li><strong>Community First:</strong> We prioritize building meaningful connections</li>
            <li><strong>Innovation:</strong> Continuously improving with cutting-edge technology</li>
            <li><strong>Accessibility:</strong> Making events discoverable and accessible to everyone</li>
            <li><strong>Privacy:</strong> Protecting user data and respecting privacy rights</li>
            <li><strong>Reliability:</strong> Providing a stable, dependable platform you can trust</li>
          </ul>
        </Section>

        <Section>
          <h2>Contact Us</h2>
          <p>
            Have questions, suggestions, or want to partner with us? We'd love to hear from you! 
            Reach out to us at <strong>eventsphere003@gmail.com</strong> or through our contact form.
          </p>
          <p>
            Follow us on social media for the latest updates and community highlights.
          </p>
        </Section>
      </Container>
    </>
  );
};

export default AboutUs;