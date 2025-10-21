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
  
  table {
    width: 100%;
    border-collapse: collapse;
    margin: 16px 0;
    
    th, td {
      border: 1px solid var(--border-color);
      padding: 12px;
      text-align: left;
    }
    
    th {
      background: var(--bg-light);
      color: var(--text-primary);
      font-weight: 600;
    }
    
    td {
      color: var(--text-secondary);
    }
  }
`;

const LastUpdated = styled.p`
  text-align: center;
  color: var(--text-muted);
  font-style: italic;
  margin-bottom: 32px;
`;

const CookiePolicy = () => {
  return (
    <>
      <ThemeBackground />
      <Container style={{ position: 'relative', zIndex: 1 }}>
        <PageTitle>Cookie <span>Policy</span></PageTitle>
        <LastUpdated>Last updated: August 2025</LastUpdated>
        
        <Content>
          <h2>What Are Cookies</h2>
          <p>Cookies are small text files that are placed on your computer or mobile device when you visit a website. They are widely used to make websites work more efficiently and provide information to website owners.</p>

          <h2>How We Use Cookies</h2>
          <p>EventSphere uses cookies to:</p>
          <ul>
            <li>Keep you signed in to your account</li>
            <li>Remember your preferences and settings</li>
            <li>Analyze how you use our platform</li>
            <li>Improve our services and user experience</li>
            <li>Provide personalized content and recommendations</li>
          </ul>

          <h2>Types of Cookies We Use</h2>
          <table>
            <thead>
              <tr>
                <th>Cookie Type</th>
                <th>Purpose</th>
                <th>Duration</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Essential Cookies</td>
                <td>Required for basic website functionality and security</td>
                <td>Session/Persistent</td>
              </tr>
              <tr>
                <td>Authentication Cookies</td>
                <td>Keep you logged in and maintain your session</td>
                <td>7 days</td>
              </tr>
              <tr>
                <td>Preference Cookies</td>
                <td>Remember your settings like theme and language</td>
                <td>1 year</td>
              </tr>
              <tr>
                <td>Analytics Cookies</td>
                <td>Help us understand how you use our platform</td>
                <td>2 years</td>
              </tr>
              <tr>
                <td>Performance Cookies</td>
                <td>Monitor platform performance and user experience</td>
                <td>1 year</td>
              </tr>
            </tbody>
          </table>

          <h2>Third-Party Cookies</h2>
          <p>We may also use third-party services that set cookies on your device:</p>
          <ul>
            <li>Google Analytics - for website analytics and performance monitoring</li>
            <li>Social media platforms - when you share content or use social login</li>
            <li>Payment processors - for secure payment processing</li>
          </ul>

          <h2>Managing Cookies</h2>
          <p>You can control and manage cookies in several ways:</p>
          <ul>
            <li><strong>Browser Settings:</strong> Most browsers allow you to view, delete, and block cookies</li>
            <li><strong>Opt-out Tools:</strong> Use browser extensions or privacy tools to manage tracking</li>
            <li><strong>Platform Settings:</strong> Adjust your privacy preferences in your account settings</li>
          </ul>

          <h2>Cookie Consent</h2>
          <p>By continuing to use EventSphere, you consent to our use of cookies as described in this policy. You can withdraw your consent at any time by adjusting your browser settings or contacting us.</p>

          <h2>Updates to This Policy</h2>
          <p>We may update this Cookie Policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the "Last updated" date.</p>

          <h2>Contact Us</h2>
          <p>If you have any questions about our use of cookies, please contact us at eventsphere003@gmail.com.</p>
        </Content>
      </Container>
    </>
  );
};

export default CookiePolicy;