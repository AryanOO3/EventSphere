import React, { useState } from 'react';
import styled from 'styled-components';
import ThemeBackground from '../components/ThemeBackground';

const Container = styled.div`
  max-width: 800px;
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

const Form = styled.form`
  background: rgba(255, 255, 255, 0.02);
  backdrop-filter: blur(20px);
  border-radius: var(--border-radius-lg);
  padding: 48px;
  border: 1px solid var(--border-color);
`;

const FormGroup = styled.div`
  margin-bottom: 24px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  color: var(--text-primary);
`;

const Input = styled.input`
  width: 100%;
  padding: 16px;
  border: 2px solid var(--border-color);
  border-radius: var(--border-radius);
  background: rgba(255, 255, 255, 0.02);
  color: var(--text-primary);
  font-size: 1rem;
  
  &:focus {
    border-color: var(--primary);
    outline: none;
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 16px;
  border: 2px solid var(--border-color);
  border-radius: var(--border-radius);
  background: rgba(255, 255, 255, 0.02);
  color: var(--text-primary);
  font-size: 1rem;
  
  &:focus {
    border-color: var(--primary);
    outline: none;
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 16px;
  border: 2px solid var(--border-color);
  border-radius: var(--border-radius);
  background: rgba(255, 255, 255, 0.02);
  color: var(--text-primary);
  font-size: 1rem;
  min-height: 120px;
  resize: vertical;
  
  &:focus {
    border-color: var(--primary);
    outline: none;
  }
`;

const RatingContainer = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 8px;
`;

const Star = styled.button`
  background: none;
  border: none;
  font-size: 2rem;
  color: ${props => props.filled ? '#ffd700' : '#ddd'};
  cursor: pointer;
  transition: var(--transition);
  
  &:hover {
    transform: scale(1.1);
  }
`;

const Button = styled.button`
  background: var(--primary);
  color: white;
  border: none;
  padding: 16px 32px;
  border-radius: var(--border-radius);
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: var(--transition);
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: var(--box-shadow-lg);
  }
`;

const Feedback = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    category: '',
    rating: 0,
    feedback: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleRating = (rating) => {
    setFormData({
      ...formData,
      rating
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Thank you for your feedback! We appreciate your input.');
    setFormData({ name: '', email: '', category: '', rating: 0, feedback: '' });
  };

  return (
    <>
      <ThemeBackground />
      <Container style={{ position: 'relative', zIndex: 1 }}>
        <PageTitle>Share Your <span>Feedback</span></PageTitle>
        
        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label htmlFor="name">Name</Label>
            <Input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </FormGroup>

          <FormGroup>
            <Label htmlFor="email">Email</Label>
            <Input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </FormGroup>

          <FormGroup>
            <Label htmlFor="category">Feedback Category</Label>
            <Select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
            >
              <option value="">Select a category</option>
              <option value="general">General Feedback</option>
              <option value="bug">Bug Report</option>
              <option value="feature">Feature Request</option>
              <option value="ui">User Interface</option>
              <option value="performance">Performance</option>
            </Select>
          </FormGroup>

          <FormGroup>
            <Label>Overall Rating</Label>
            <RatingContainer>
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  type="button"
                  filled={star <= formData.rating}
                  onClick={() => handleRating(star)}
                >
                  ★
                </Star>
              ))}
            </RatingContainer>
          </FormGroup>

          <FormGroup>
            <Label htmlFor="feedback">Your Feedback</Label>
            <TextArea
              id="feedback"
              name="feedback"
              value={formData.feedback}
              onChange={handleChange}
              placeholder="Please share your thoughts, suggestions, or report any issues..."
              required
            />
          </FormGroup>

          <Button type="submit">Submit Feedback</Button>
        </Form>
      </Container>
    </>
  );
};

export default Feedback;