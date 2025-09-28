import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import ThemeBackground from '../components/ThemeBackground';
import axios from 'axios';

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

const FormContainer = styled.div`
  max-width: 480px;
  width: 100%;
  background: rgba(255, 255, 255, 0.02);
  backdrop-filter: blur(20px);
  border-radius: var(--border-radius-lg);
  box-shadow: var(--box-shadow-xl);
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
`;

const FormHeader = styled.div`
  text-align: center;
  padding: 48px 48px 32px;
  
  @media screen and (max-width: 768px) {
    padding: 32px 32px 24px;
  }
`;

const FormTitle = styled.h1`
  font-size: 2.5rem;
  margin-bottom: 16px;
  color: var(--text-primary);
  font-weight: 800;
  letter-spacing: -0.02em;
  
  span {
    background: var(--gradient-primary);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  
  @media screen and (max-width: 768px) {
    font-size: 2rem;
  }
`;

const FormSubtitle = styled.p`
  color: var(--text-secondary);
  font-size: 1.1rem;
  font-weight: 500;
  line-height: 1.6;
  
  @media screen and (max-width: 768px) {
    font-size: 1rem;
  }
`;

const Form = styled.form`
  padding: 0 48px 48px;
  
  @media screen and (max-width: 768px) {
    padding: 0 32px 32px;
  }
`;

const FormGroup = styled.div`
  margin-bottom: 24px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 12px;
  font-weight: 700;
  color: var(--text-primary);
  font-size: 1.1rem;
  letter-spacing: 0.02em;
  
  @media screen and (max-width: 768px) {
    font-size: 1rem;
  }
`;

const Input = styled.input`
  width: 100%;
  padding: 16px 20px;
  border: 2px solid var(--border-color);
  border-radius: var(--border-radius);
  font-size: 1.1rem;
  font-family: 'Poppins', sans-serif;
  transition: var(--transition);
  background: rgba(255, 255, 255, 0.02);
  backdrop-filter: blur(20px);
  color: var(--text-primary);
  box-shadow: var(--box-shadow);
  outline: none !important;
  
  &:focus {
    border: 2px solid transparent;
    background: linear-gradient(var(--bg-white), var(--bg-white)) padding-box, var(--gradient-primary) border-box;
    box-shadow: 0 0 0 3px rgba(108, 99, 255, 0.1);
    outline: none !important;
    transform: translateY(-2px);
  }
  
  &:hover {
    border: 2px solid transparent;
    background: linear-gradient(var(--bg-white), var(--bg-white)) padding-box, var(--gradient-primary) border-box;
    transform: translateY(-1px);
    box-shadow: var(--box-shadow-lg);
  }
  
  @media screen and (max-width: 768px) {
    padding: 14px 16px;
    font-size: 1rem;
  }
`;

const Button = styled.button`
  width: 100%;
  padding: 16px 32px;
  background: var(--gradient-primary);
  color: white;
  border: none;
  border-radius: var(--border-radius);
  font-size: 1.1rem;
  font-weight: 700;
  cursor: pointer;
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
  
  &:hover:not(:disabled) {
    background: linear-gradient(135deg, #8B7FFF 0%, #B490FF 50%, #D8A7FF 100%);
    transform: translateY(-2px);
    box-shadow: var(--box-shadow-xl);
    outline: none !important;
  }
  
  &:focus {
    outline: none !important;
  }
  
  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
    transform: none;
    
    &:hover {
      transform: none;
      box-shadow: var(--box-shadow-lg);
    }
  }
  
  @media screen and (max-width: 768px) {
    padding: 14px 28px;
    font-size: 1rem;
  }
`;

const Message = styled.div`
  padding: 16px 20px;
  border-radius: var(--border-radius);
  margin-bottom: 24px;
  font-weight: 600;
  text-align: center;
  box-shadow: var(--box-shadow);
  
  &.error {
    background: linear-gradient(135deg, #ffebee 0%, #ffcdd2 100%);
    color: #c62828;
    border: 1px solid #ef5350;
  }
  
  &.success {
    background: linear-gradient(135deg, #e8f5e8 0%, #c8e6c9 100%);
    color: #2e7d32;
    border: 1px solid #66bb6a;
  }
`;

const PasswordStrength = styled.div`
  margin-top: 8px;
  padding: 8px 12px;
  border-radius: var(--border-radius);
  font-size: 0.9rem;
  font-weight: 600;
  
  &.weak {
    background: linear-gradient(135deg, #ffebee 0%, #ffcdd2 100%);
    color: #c62828;
    border: 1px solid #ef5350;
  }
  
  &.medium {
    background: linear-gradient(135deg, #fff3e0 0%, #ffcc02 100%);
    color: #e65100;
    border: 1px solid #ff9800;
  }
  
  &.strong {
    background: linear-gradient(135deg, #e8f5e8 0%, #c8e6c9 100%);
    color: #2e7d32;
    border: 1px solid #66bb6a;
  }
`;

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const getPasswordStrength = (password) => {
    if (password.length < 6) return { level: 'weak', text: 'Password must be at least 6 characters' };
    if (password.length < 8) return { level: 'medium', text: 'Password strength: Medium' };
    if (password.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)) {
      return { level: 'strong', text: 'Password strength: Strong' };
    }
    return { level: 'medium', text: 'Password strength: Medium' };
  };
  
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    
    if (!formData.password || !formData.confirmPassword) {
      setError('Please fill in all fields');
      return;
    }
    
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    
    try {
      setIsLoading(true);
      await axios.post(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/auth/reset-password`, {
        token,
        password: formData.password
      });
      setMessage('Password reset successful! Redirecting to login...');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to reset password');
    } finally {
      setIsLoading(false);
    }
  };
  
  const passwordStrength = getPasswordStrength(formData.password);
  
  return (
    <>
      <ThemeBackground />
      <PageContainer style={{ position: 'relative', zIndex: 1 }}>
      <FormContainer className="animate-fade-in">
        <FormHeader>
          <FormTitle>Set New <span>Password</span></FormTitle>
          <FormSubtitle>
            Enter your new password below to complete the reset process
          </FormSubtitle>
        </FormHeader>
        
        <Form onSubmit={handleSubmit}>
          {error && <Message className="error">{error}</Message>}
          {message && <Message className="success">{message}</Message>}
          
          <FormGroup>
            <Label htmlFor="password">New Password</Label>
            <Input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter new password"
              required
            />
            {formData.password && (
              <PasswordStrength className={passwordStrength.level}>
                {passwordStrength.text}
              </PasswordStrength>
            )}
          </FormGroup>
          
          <FormGroup>
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm new password"
              required
            />
            {formData.confirmPassword && formData.password !== formData.confirmPassword && (
              <PasswordStrength className="weak">
                Passwords do not match
              </PasswordStrength>
            )}
          </FormGroup>
          
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Resetting Password...' : 'Reset Password'}
          </Button>
        </Form>
      </FormContainer>
      </PageContainer>
    </>
  );
};

export default ResetPassword;