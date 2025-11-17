import React, { useState, useContext, useEffect } from 'react';
import styled from 'styled-components';
import { AuthContext } from '../context/AuthContext';
import ProfilePictureUpload from '../components/ProfilePictureUpload';
import ThemeBackground from '../components/ThemeBackground';
import api from '../utils/api';

const ProfileContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 80px 40px;
  min-height: 100vh;
  
  @media screen and (max-width: 1024px) {
    padding: 60px 24px;
  }
  
  @media screen and (max-width: 768px) {
    padding: 40px 16px;
  }
`;

const PageTitle = styled.h1`
  font-size: 3rem;
  margin-bottom: 48px;
  color: var(--text-primary);
  font-weight: 800;
  letter-spacing: -0.02em;
  text-align: center;
  position: relative;
  
  span {
    background: var(--gradient-primary);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  
  @media screen and (max-width: 1024px) {
    font-size: 2.5rem;
    margin-bottom: 40px;
  }
  
  @media screen and (max-width: 768px) {
    font-size: 2rem;
    margin-bottom: 32px;
  }
`;

const FormContainer = styled.div`
  background: rgba(255, 255, 255, 0.02);
  backdrop-filter: blur(20px);
  padding: 48px;
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
  
  @media screen and (max-width: 768px) {
    padding: 32px 24px;
  }
`;

const Form = styled.form`
  margin-top: 32px;
`;

const FormGroup = styled.div`
  margin-bottom: 32px;
  
  @media screen and (max-width: 768px) {
    margin-bottom: 24px;
  }
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
    border-color: var(--primary);
    background: rgba(255, 255, 255, 0.05);
    box-shadow: 0 0 0 3px rgba(108, 99, 255, 0.1);
    outline: none !important;
    transform: translateY(-2px);
  }
  
  &:hover:not(:disabled) {
    border-color: var(--primary);
    background: rgba(255, 255, 255, 0.05);
    transform: translateY(-1px);
    box-shadow: var(--box-shadow-lg);
  }
  
  &:disabled {
    background: rgba(255, 255, 255, 0.01);
    backdrop-filter: blur(10px);
    cursor: not-allowed;
    opacity: 0.7;
    
    &:hover {
      transform: none;
      box-shadow: var(--box-shadow);
    }
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

const ProfileSection = styled.div`
  text-align: center;
  margin-bottom: 40px;
  padding: 32px;
  background: rgba(255, 255, 255, 0.02);
  backdrop-filter: blur(20px);
  border-radius: var(--border-radius);
  border: 1px solid var(--border-color);
  box-shadow: var(--box-shadow);
  
  @media screen and (max-width: 768px) {
    padding: 24px;
    margin-bottom: 32px;
  }
`;

const Profile = () => {
  const { currentUser, setCurrentUser } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    name: '',
    email: ''
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (currentUser) {
      setFormData({
        name: currentUser.name || '',
        email: currentUser.email || ''
      });
    }
  }, [currentUser]);

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

    if (!formData.name) {
      setError('Name is required');
      return;
    }

    try {
      setIsLoading(true);
      const response = await api.put('/users/profile', { name: formData.name });
      
      const updatedUser = { ...currentUser, ...response.data.user };
      setCurrentUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      setMessage('Profile updated successfully');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  const handleProfilePictureUpdate = (updatedUser) => {
    const newUser = { ...currentUser, ...updatedUser };
    setCurrentUser(newUser);
    localStorage.setItem('user', JSON.stringify(newUser));
    setMessage('Profile picture updated successfully');
  };

  return (
    <>
      <ThemeBackground />
      <ProfileContainer style={{ position: 'relative', zIndex: 1 }}>
      <PageTitle className="animate-fade-in">My <span>Profile</span></PageTitle>
      
      <FormContainer>
        <ProfileSection>
          <ProfilePictureUpload 
            currentUser={currentUser} 
            onUpdate={handleProfilePictureUpdate}
          />
        </ProfileSection>
        
        <Form onSubmit={handleSubmit}>
          {error && <Message className="error">{error}</Message>}
          {message && <Message className="success">{message}</Message>}
          
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
              disabled
              placeholder="Your email address"
            />
          </FormGroup>
          
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Updating Profile...' : 'Update Profile'}
          </Button>
        </Form>
      </FormContainer>
      </ProfileContainer>
    </>
  );
};

export default Profile;