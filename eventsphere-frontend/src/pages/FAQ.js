import React, { useState } from 'react';
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

const FAQItem = styled.div`
  background: rgba(255, 255, 255, 0.02);
  backdrop-filter: blur(20px);
  border-radius: var(--border-radius-lg);
  margin-bottom: 16px;
  border: 1px solid var(--border-color);
  overflow: hidden;
`;

const Question = styled.button`
  width: 100%;
  padding: 24px;
  background: none;
  border: none;
  text-align: left;
  color: var(--text-primary);
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  
  &:hover {
    background: rgba(255, 255, 255, 0.05);
  }
  
  span {
    transition: transform 0.3s ease;
    transform: ${props => props.isOpen ? 'rotate(45deg)' : 'rotate(0deg)'};
  }
`;

const Answer = styled.div`
  padding: ${props => props.isOpen ? '0 24px 24px' : '0'};
  max-height: ${props => props.isOpen ? '200px' : '0'};
  overflow: hidden;
  transition: all 0.3s ease;
  color: var(--text-secondary);
  line-height: 1.6;
`;

const FAQ = () => {
  const [openItems, setOpenItems] = useState({});

  const toggleItem = (index) => {
    setOpenItems(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const faqs = [
    {
      question: "How do I create an event?",
      answer: "To create an event, log in to your account and click 'Create Event' in the navigation. Fill in the event details including title, description, date, time, and location. You can also add a cover image and select categories."
    },
    {
      question: "How do I RSVP to an event?",
      answer: "Browse events and click on any event you're interested in. On the event details page, click the 'RSVP' button and select 'Going' or 'Not Going'. You'll receive a QR code if you RSVP as going."
    },
    {
      question: "Can I edit my event after creating it?",
      answer: "Yes, you can edit your events. Go to your dashboard, find the event you want to edit, and click the edit button. You can modify all event details except the date if RSVPs have already been made. Note: Advanced editing features are available to Admin and Super Admin users."
    },
    {
      question: "How does the QR code check-in work?",
      answer: "When you RSVP 'Going' to an event, you'll receive a QR code. Event organizers with Admin or Super Admin privileges can scan this code at the event venue to check you in. The QR code contains your unique attendance information."
    },
    {
      question: "Can I cancel my RSVP?",
      answer: "Yes, you can change your RSVP status at any time before the event. Simply go back to the event page and update your RSVP status."
    },
    {
      question: "How do I upload a profile picture?",
      answer: "Go to your profile page and click on the profile picture area. You can upload a new image from your device. Supported formats are JPG, PNG, and GIF."
    },
    {
      question: "What are the different user roles?",
      answer: "EventSphere has three user roles: Regular Users (can attend events and create basic events), Admins (can manage events, scan QR codes, view attendance, and access admin dashboard), and Super Admins (full system access including user management, categories, tags, and advanced analytics)."
    },
    {
      question: "What features require Admin or Super Admin access?",
      answer: "Admin-only features include: QR code scanning, viewing event check-ins, accessing admin dashboard, and managing event categories. Super Admin-only features include: user role management, deleting users, system-wide analytics, and managing platform categories and tags."
    },
    {
      question: "How do I reset my password?",
      answer: "On the login page, click 'Forgot Password' and enter your email address. You'll receive a password reset link via email. Follow the link to create a new password."
    },
    {
      question: "How do I become an Admin or Super Admin?",
      answer: "User roles can only be changed by existing Super Admin users. Contact a Super Admin or the platform administrator to request role changes. Regular users cannot upgrade their own permissions."
    }
  ];

  return (
    <>
      <ThemeBackground />
      <Container style={{ position: 'relative', zIndex: 1 }}>
        <PageTitle>Frequently Asked <span>Questions</span></PageTitle>
        
        {faqs.map((faq, index) => (
          <FAQItem key={index}>
            <Question 
              isOpen={openItems[index]} 
              onClick={() => toggleItem(index)}
            >
              {faq.question}
              <span>+</span>
            </Question>
            <Answer isOpen={openItems[index]}>
              {faq.answer}
            </Answer>
          </FAQItem>
        ))}
      </Container>
    </>
  );
};

export default FAQ;