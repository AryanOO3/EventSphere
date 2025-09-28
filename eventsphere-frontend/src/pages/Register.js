import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { AuthContext } from '../context/AuthContext';
import Logo from '../components/Logo';
import ThemeBackground from '../components/ThemeBackground';

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
`;

const FormContainer = styled.div`
  max-width: 480px;
  width: 100%;
  background: rgba(255, 255, 255, 0.02);
  backdrop-filter: blur(20px);
  border-radius: var(--border-radius-lg);
  box-shadow: var(--box-shadow-xl);
  border: 1px solid var(--border-color);
  overflow: hidden;
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: var(--gradient-primary);
  }
  
  @media screen and (max-width: 640px) {
    max-width: 400px;
    margin: 0 16px;
  }
`;

const FormHeader = styled.div`
  text-align: center;
  padding: 48px 48px 32px;
  
  @media screen and (max-width: 640px) {
    padding: 32px 24px 24px;
  }
`;

const FormTitle = styled.h1`
  font-size: 2.5rem;
  font-weight: 800;
  margin-bottom: 8px;
  background: var(--gradient-primary);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  
  @media screen and (max-width: 640px) {
    font-size: 2rem;
  }
`;

const FormSubtitle = styled.p`
  color: var(--text-secondary);
  font-size: 1.1rem;
`;

const Form = styled.form`
  padding: 0 48px 48px;
  
  @media screen and (max-width: 640px) {
    padding: 0 24px 32px;
  }
`;

const FormGroup = styled.div`
  margin-bottom: 24px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  color: var(--text-primary);
  font-size: 0.95rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 16px 20px;
  border: 2px solid var(--border-color);
  border-radius: var(--border-radius);
  font-size: 16px;
  font-weight: 500;
  transition: var(--transition);
  background: rgba(255, 255, 255, 0.02);
  backdrop-filter: blur(20px);
  color: var(--text-primary);
  
  &:focus {
    outline: none;
    border: 2px solid transparent;
    background: linear-gradient(rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.05)) padding-box, var(--gradient-primary) border-box;
    box-shadow: 0 0 0 3px rgba(108, 99, 255, 0.1);
    transform: translateY(-1px);
  }
  
  &:hover {
    border: 2px solid transparent;
    background: linear-gradient(rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.05)) padding-box, var(--gradient-primary) border-box;
    transform: translateY(-1px);
  }
  
  &::placeholder {
    color: var(--text-muted);
  }
`;

const RegisterButton = styled.button`
  width: 100%;
  padding: 16px 32px;
  background: var(--gradient-primary);
  color: white;
  border: none;
  border-radius: var(--border-radius);
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: var(--transition);
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
    transform: translateY(-2px);
    box-shadow: var(--box-shadow-lg);
  }
  
  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
    transform: none;
    
    &:hover {
      transform: none;
      box-shadow: none;
    }
  }
`;

const ErrorMessage = styled.div`
  background: linear-gradient(135deg, #fee, #fdd);
  color: #d32f2f;
  padding: 16px 20px;
  border-radius: var(--border-radius);
  margin-bottom: 24px;
  border: 1px solid #ffcdd2;
  font-weight: 500;
`;

const SuccessMessage = styled.div`
  background: linear-gradient(135deg, #e8f5e8, #c8e6c9);
  color: #2e7d32;
  padding: 16px 20px;
  border-radius: var(--border-radius);
  margin-bottom: 24px;
  border: 1px solid #a5d6a7;
  font-weight: 500;
`;

const FormLinks = styled.div`
  text-align: center;
  margin-top: 32px;
  color: var(--text-secondary);
  
  a {
    color: var(--primary);
    text-decoration: none;
    font-weight: 600;
    transition: var(--transition);
    
    &:hover {
      color: var(--primary-dark);
    }
  }
`;

const PasswordStrength = styled.div`
  margin-top: 8px;
  font-size: 0.85rem;
  color: ${props => {
    if (props.strength === 'weak') return '#f44336';
    if (props.strength === 'medium') return '#ff9800';
    if (props.strength === 'strong') return '#4caf50';
    return 'var(--text-muted)';
  }};
`;

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const getPasswordStrength = (password) => {
    if (password.length < 6) return 'weak';
    if (password.length < 10) return 'medium';
    return 'strong';
  };
  
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess('');
    
    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      setFormError('Please fill in all fields');
      return;
    }
    
    if (formData.password !== formData.confirmPassword) {
      setFormError('Passwords do not match');
      return;
    }
    
    if (formData.password.length < 6) {
      setFormError('Password must be at least 6 characters');
      return;
    }
    
    try {
      setIsLoading(true);
      const response = await register({
        name: formData.name,
        email: formData.email,
        password: formData.password
      });
      
      if (response.token && response.user) {
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
        
        setFormSuccess('🎉 Account created successfully! Redirecting...');
        
        setTimeout(() => {
          navigate('/dashboard');
        }, 1500);
      }
    } catch (error) {
      setFormError(error.response?.data?.error || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const passwordStrength = getPasswordStrength(formData.password);
  
  return (
    <>
      <ThemeBackground />
      <Container style={{ position: 'relative', zIndex: 1 }}>
      <FormContainer className="animate-fade-in">
        <FormHeader>
          <Logo size="80px" />
          <FormTitle>Join EventSphere</FormTitle>
          <FormSubtitle>Create your account to get started</FormSubtitle>
        </FormHeader>
        
        <Form onSubmit={handleSubmit}>
          {formError && <ErrorMessage>{formError}</ErrorMessage>}
          {formSuccess && <SuccessMessage>{formSuccess}</SuccessMessage>}
          
          <FormGroup>
            <Label htmlFor="name">Full Name</Label>
            <Input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your full name"
              required
            />
          </FormGroup>
          
          <FormGroup>
            <Label htmlFor="email">Email Address</Label>
            <Input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email address"
              required
            />
          </FormGroup>
          
          <FormGroup>
            <Label htmlFor="password">Password</Label>
            <Input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Create a secure password"
              required
            />
            {formData.password && (
              <PasswordStrength strength={passwordStrength}>
                Password strength: {passwordStrength === 'weak' ? '🔴 Weak' : passwordStrength === 'medium' ? '🟡 Medium' : '🟢 Strong'}
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
              placeholder="Confirm your password"
              required
            />
          </FormGroup>
          
          <RegisterButton type="submit" disabled={isLoading}>
            {isLoading ? 'Creating Account...' : 'Create Account'}
          </RegisterButton>
          
          <FormLinks>
            Already have an account? <Link to="/login">Sign in here</Link>
          </FormLinks>
        </Form>
      </FormContainer>
      </Container>
    </>
  );
};

export default Register;