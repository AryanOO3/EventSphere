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
  margin-bottom: 32px;
`;

const DemoCredentials = styled.div`
  background: linear-gradient(135deg, #f0f8ff, #e6f3ff);
  padding: 20px;
  border-radius: var(--border-radius);
  margin-bottom: 32px;
  font-size: 0.9rem;
  border: 1px solid #b3d9ff;
  
  strong {
    color: var(--primary);
  }
  
  @media screen and (max-width: 640px) {
    padding: 16px;
    font-size: 0.85rem;
  }
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
    border-color: var(--primary);
    box-shadow: 0 0 0 3px rgba(108, 99, 255, 0.1);
    transform: translateY(-1px);
  }
  
  &::placeholder {
    color: var(--text-muted);
  }
`;

const QuickLoginGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 12px;
  margin-bottom: 24px;
  
  @media screen and (max-width: 640px) {
    grid-template-columns: 1fr;
    gap: 8px;
  }
`;

const QuickLoginButton = styled.button`
  padding: 12px 16px;
  border: none;
  border-radius: var(--border-radius);
  font-size: 0.9rem;
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
`;

const SuperAdminBtn = styled(QuickLoginButton)`
  background: #dc3545;
  color: white;
  
  &:hover {
    background: #c82333;
  }
`;

const AdminBtn = styled(QuickLoginButton)`
  background: #ff6b35;
  color: white;
  
  &:hover {
    background: #e55a2b;
  }
`;

const UserBtn = styled(QuickLoginButton)`
  background: #28a745;
  color: white;
  
  &:hover {
    background: #218838;
  }
`;

const LoginButton = styled.button`
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

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [formError, setFormError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    
    if (!formData.email || !formData.password) {
      setFormError('Please fill in all fields');
      return;
    }
    
    try {
      setIsLoading(true);
      await login(formData.email, formData.password);
      navigate('/dashboard');
    } catch (error) {
      setFormError(error.response?.data?.error || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <>
      <ThemeBackground />
      <Container style={{ position: 'relative', zIndex: 1 }}>
      <FormContainer className="animate-fade-in">
        <FormHeader>
          <Logo size="80px" />
          <FormTitle>Welcome Back</FormTitle>
          <FormSubtitle>Sign in to your EventSphere account</FormSubtitle>
          
          <DemoCredentials>
            <strong>🚀 Quick Demo Access:</strong><br/>
            <strong>SuperAdmin:</strong> superadmin@eventsphere.com / super123<br/>
            <strong>Admin:</strong> admin@eventsphere.com / admin123<br/>
            <strong>User:</strong> user@eventsphere.com / user123
          </DemoCredentials>
        </FormHeader>
        
        <Form onSubmit={handleSubmit}>
          {formError && <ErrorMessage>{formError}</ErrorMessage>}
          
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
              placeholder="Enter your password"
              required
            />
          </FormGroup>
          
          <QuickLoginGrid>
            <SuperAdminBtn 
              type="button" 
              onClick={() => setFormData({ email: 'superadmin@eventsphere.com', password: 'super123' })}
            >
              SuperAdmin
            </SuperAdminBtn>
            <AdminBtn 
              type="button" 
              onClick={() => setFormData({ email: 'admin@eventsphere.com', password: 'admin123' })}
            >
              Admin
            </AdminBtn>
            <UserBtn 
              type="button" 
              onClick={() => setFormData({ email: 'user@eventsphere.com', password: 'user123' })}
            >
              User
            </UserBtn>
          </QuickLoginGrid>
          
          <LoginButton type="submit" disabled={isLoading}>
            {isLoading ? 'Signing in...' : 'Sign In'}
          </LoginButton>
          
          <FormLinks>
            Don't have an account? <Link to="/register">Create one here</Link><br/>
            <Link to="/forgot-password">Forgot your password?</Link>
          </FormLinks>
        </Form>
      </FormContainer>
      </Container>
    </>
  );
};

export default Login;