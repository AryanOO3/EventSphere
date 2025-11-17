import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import Logo from './Logo';

const FooterContainer = styled.footer`
  background: rgba(255, 255, 255, 0.02);
  backdrop-filter: blur(20px);
  border-top: 1px solid var(--border-color);
  padding: 48px 0 24px;
  margin-top: auto;
`;

const FooterContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 40px;
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr;
  gap: 48px;
  
  @media screen and (max-width: 1024px) {
    padding: 0 24px;
    grid-template-columns: 1fr 1fr;
    gap: 32px;
  }
  
  @media screen and (max-width: 768px) {
    padding: 0 16px;
    grid-template-columns: 1fr;
    gap: 24px;
    text-align: center;
  }
`;

const FooterSection = styled.div`
  h3 {
    color: var(--text-primary);
    font-size: 1.2rem;
    font-weight: 700;
    margin-bottom: 16px;
  }
  
  p {
    color: var(--text-secondary);
    line-height: 1.6;
    margin-bottom: 16px;
  }
`;

const FooterLinks = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  
  a {
    color: var(--text-secondary);
    text-decoration: none;
    transition: var(--transition);
    
    &:hover {
      color: var(--primary);
    }
  }
`;

const FooterBottom = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px 40px 0;
  border-top: 1px solid var(--border-color);
  text-align: center;
  color: var(--text-secondary);
  font-size: 0.9rem;
  
  @media screen and (max-width: 768px) {
    padding: 24px 16px 0;
  }
`;

const Footer = () => {
  return (
    <FooterContainer>
      <FooterContent>
        <FooterSection>
          <Logo size="60px" />
          <p>
            EventSphere is your go-to platform for discovering and managing amazing events. 
            Connect with your community and never miss out on exciting experiences.
          </p>
        </FooterSection>
        
        <FooterSection>
          <h3>Quick Links</h3>
          <FooterLinks>
            <Link to="/events">Browse Events</Link>
            <Link to="/create-event">Create Event</Link>
            <Link to="/calendar">Event Calendar</Link>
            <Link to="/dashboard">Dashboard</Link>
          </FooterLinks>
        </FooterSection>
        
        <FooterSection>
          <h3>Support</h3>
          <FooterLinks>
            <Link to="/help">Help Center</Link>
            <Link to="/contact">Contact Us</Link>
            <Link to="/faq">FAQ</Link>
            <Link to="/feedback">Feedback</Link>
          </FooterLinks>
        </FooterSection>
        
        <FooterSection>
          <h3>Legal</h3>
          <FooterLinks>
            <Link to="/privacy">Privacy Policy</Link>
            <Link to="/terms">Terms of Service</Link>
            <Link to="/cookies">Cookie Policy</Link>
            <Link to="/about">About Us</Link>
          </FooterLinks>
        </FooterSection>
      </FooterContent>
      
      <FooterBottom>
        <p>&copy; 2025 EventSphere. All rights reserved.</p>
      </FooterBottom>
    </FooterContainer>
  );
};

export default Footer;