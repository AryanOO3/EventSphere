import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import ThemeBackground from '../components/ThemeBackground';

const PageContainer = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  position: relative;
  
  @media screen and (max-width: 768px) {
    padding: 20px 16px;
  }
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  max-width: 600px;
  width: 100%;
  background: rgba(255, 255, 255, 0.02);
  backdrop-filter: blur(20px);
  border-radius: var(--border-radius-lg);
  padding: 80px 48px;
  box-shadow: var(--box-shadow-xl);
  border: 1px solid var(--border-color);
  position: relative;
  overflow: hidden;
  transition: var(--transition);
  
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
    padding: 60px 32px;
  }
  
  @media screen and (max-width: 480px) {
    padding: 40px 24px;
  }
`;

const ErrorIcon = styled.div`
  font-size: 8rem;
  margin-bottom: 32px;
  background: var(--gradient-primary);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: pulse 2s ease-in-out infinite;
  
  @keyframes pulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.05); }
  }
  
  @media screen and (max-width: 768px) {
    font-size: 6rem;
    margin-bottom: 24px;
  }
  
  @media screen and (max-width: 480px) {
    font-size: 5rem;
    margin-bottom: 20px;
  }
`;

const Title = styled.h1`
  font-size: 4rem;
  color: var(--danger);
  margin-bottom: 24px;
  font-weight: 800;
  letter-spacing: -0.02em;
  
  @media screen and (max-width: 768px) {
    font-size: 3rem;
    margin-bottom: 20px;
  }
  
  @media screen and (max-width: 480px) {
    font-size: 2.5rem;
    margin-bottom: 16px;
  }
`;

const Subtitle = styled.h2`
  font-size: 1.8rem;
  color: var(--text-primary);
  margin-bottom: 16px;
  font-weight: 700;
  
  @media screen and (max-width: 768px) {
    font-size: 1.6rem;
  }
  
  @media screen and (max-width: 480px) {
    font-size: 1.4rem;
  }
`;

const Message = styled.p`
  font-size: 1.2rem;
  color: var(--text-secondary);
  margin-bottom: 48px;
  line-height: 1.6;
  max-width: 500px;
  font-weight: 500;
  
  @media screen and (max-width: 768px) {
    font-size: 1.1rem;
    margin-bottom: 40px;
  }
  
  @media screen and (max-width: 480px) {
    font-size: 1rem;
    margin-bottom: 32px;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 16px;
  justify-content: center;
  flex-wrap: wrap;
  
  @media screen and (max-width: 480px) {
    flex-direction: column;
    gap: 12px;
    width: 100%;
  }
`;

const BackButton = styled(Link)`
  display: inline-block;
  background: var(--gradient-primary);
  color: white;
  padding: 16px 32px;
  border-radius: var(--border-radius);
  font-weight: 700;
  font-size: 1.1rem;
  text-decoration: none;
  transition: var(--transition);
  position: relative;
  overflow: hidden;
  box-shadow: var(--box-shadow-lg);
  outline: none !important;
  
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
    background: linear-gradient(135deg, #8B7FFF 0%, #B490FF 50%, #D8A7FF 100%);
    transform: translateY(-2px);
    box-shadow: var(--box-shadow-xl);
    color: white;
    outline: none !important;
  }
  
  &:focus {
    outline: none !important;
  }
  
  @media screen and (max-width: 768px) {
    padding: 14px 28px;
    font-size: 1rem;
  }
  
  @media screen and (max-width: 480px) {
    width: 100%;
    text-align: center;
  }
`;

const SecondaryButton = styled(Link)`
  display: inline-block;
  background: var(--bg-white);
  color: var(--text-primary);
  padding: 16px 32px;
  border: 2px solid var(--border-color);
  border-radius: var(--border-radius);
  font-weight: 700;
  font-size: 1.1rem;
  text-decoration: none;
  transition: var(--transition);
  box-shadow: var(--box-shadow);
  outline: none !important;
  
  &:hover {
    background: var(--bg-light);
    border-color: var(--primary);
    transform: translateY(-2px);
    box-shadow: var(--box-shadow-lg);
    color: var(--text-primary);
    outline: none !important;
  }
  
  &:focus {
    outline: none !important;
  }
  
  @media screen and (max-width: 768px) {
    padding: 14px 28px;
    font-size: 1rem;
  }
  
  @media screen and (max-width: 480px) {
    width: 100%;
    text-align: center;
  }
`;

const Unauthorized = () => {
  return (
    <>
      <ThemeBackground />
      <PageContainer style={{ position: 'relative', zIndex: 1 }}>
      <Container className="animate-fade-in">
        <ErrorIcon>🚫</ErrorIcon>
        <Title>403</Title>
        <Subtitle>Access Denied</Subtitle>
        <Message>
          You don't have permission to access this page. Please contact your administrator if you believe this is an error.
        </Message>
        <ButtonGroup>
          <BackButton to="/">Go Back Home</BackButton>
          <SecondaryButton to="/login">Sign In</SecondaryButton>
        </ButtonGroup>
      </Container>
      </PageContainer>
    </>
  );
};

export default Unauthorized;