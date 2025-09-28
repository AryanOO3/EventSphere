import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import CoverImageUpload from '../components/CoverImageUpload';
import ThemeBackground from '../components/ThemeBackground';
import api from '../utils/api';

const EditEventContainer = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  padding: 80px 40px;
  min-height: 100vh;
  position: relative;
  transition: var(--transition);
  
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

const FormContainer = styled.form`
  background: rgba(255, 255, 255, 0.02);
  backdrop-filter: blur(20px);
  border-radius: var(--border-radius-lg);
  padding: 48px;
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
    padding: 32px 24px;
  }
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
  font-family: 'Poppins', sans-serif;
  font-size: 1.1rem;
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

const TextArea = styled.textarea`
  width: 100%;
  padding: 16px 20px;
  border: 2px solid var(--border-color);
  border-radius: var(--border-radius);
  font-family: 'Poppins', sans-serif;
  font-size: 1.1rem;
  resize: vertical;
  min-height: 150px;
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

const Select = styled.select`
  width: 100%;
  padding: 16px 20px;
  border: 2px solid var(--border-color);
  border-radius: var(--border-radius);
  font-family: 'Poppins', sans-serif;
  font-size: 1.1rem;
  background: rgba(255, 255, 255, 0.02);
  backdrop-filter: blur(20px);
  color: var(--text-primary);
  cursor: pointer;
  transition: var(--transition);
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

const FormRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  
  @media screen and (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 16px;
  }
`;

const TagsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 12px;
  padding: 16px;
  background: rgba(255, 255, 255, 0.02);
  backdrop-filter: blur(20px);
  border-radius: var(--border-radius);
  border: 1px solid var(--border-color);
  
  @media screen and (max-width: 768px) {
    gap: 8px;
    padding: 12px;
  }
`;

const TagLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: rgba(255, 255, 255, 0.02);
  backdrop-filter: blur(20px);
  border-radius: var(--border-radius);
  border: 1px solid var(--border-color);
  cursor: pointer;
  transition: var(--transition);
  font-size: 0.95rem;
  font-weight: 500;
  color: var(--text-primary);
  
  &:hover {
    background: var(--gradient-primary);
    color: white;
    transform: translateY(-1px);
    box-shadow: var(--box-shadow);
  }
  
  input[type="checkbox"] {
    margin: 0;
  }
  
  @media screen and (max-width: 768px) {
    padding: 6px 10px;
    font-size: 0.9rem;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 16px;
  justify-content: flex-start;
  margin-top: 40px;
  
  @media screen and (max-width: 768px) {
    flex-direction: column;
    gap: 12px;
  }
`;

const Button = styled.button`
  padding: 16px 32px;
  border: none;
  border-radius: var(--border-radius);
  font-weight: 700;
  font-size: 1.1rem;
  cursor: pointer;
  transition: var(--transition);
  position: relative;
  overflow: hidden;
  outline: none !important;
  
  &.primary {
    background: var(--gradient-primary);
    color: white;
    box-shadow: var(--box-shadow-lg);
    
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
    }
  }
  
  &.secondary {
    background: var(--bg-white);
    color: var(--text-primary);
    border: 2px solid var(--border-color);
    box-shadow: var(--box-shadow);
    
    &:hover {
      background: var(--bg-light);
      border-color: var(--primary);
      transform: translateY(-2px);
      box-shadow: var(--box-shadow-lg);
    }
  }
  
  &.danger {
    background: linear-gradient(135deg, #dc3545 0%, #c82333 100%);
    color: white;
    box-shadow: var(--box-shadow-lg);
    
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
      background: linear-gradient(135deg, #c82333 0%, #a71e2a 100%);
      transform: translateY(-2px);
      box-shadow: var(--box-shadow-xl);
    }
  }
  
  @media screen and (max-width: 768px) {
    padding: 14px 28px;
    font-size: 1rem;
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 20px;
  
  .spinner {
    width: 40px;
    height: 40px;
    border: 4px solid var(--border-color);
    border-top: 4px solid var(--primary);
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin-bottom: 16px;
  }
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  
  p {
    color: var(--text-secondary);
    font-size: 1.1rem;
    font-weight: 500;
  }
`;

const EditEvent = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    event_date: '',
    event_time: '',
    location: '',
    category_id: '',
    tags: [],
    rsvp_limit: '',
    cover_image: null
  });
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvent();
    fetchCategories();
    fetchTags();
  }, [id]);

  const fetchEvent = async () => {
    try {
      const response = await api.get(`/events/${id}`);
      const event = response.data.event;
      
      const eventDate = new Date(event.date);
      setFormData({
        title: event.title,
        description: event.description,
        event_date: eventDate.toISOString().split('T')[0],
        event_time: event.time || '',
        location: event.location,
        category_id: event.category_id || '',
        tags: event.tags || [],
        rsvp_limit: event.rsvp_limit || ''
      });
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch event:', error);
      navigate('/event-manager');
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await api.get('/categories');
      setCategories(response.data.categories);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  };

  const fetchTags = async () => {
    try {
      const response = await api.get('/tags');
      setTags(response.data.tags);
    } catch (error) {
      console.error('Failed to fetch tags:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleTagChange = (e) => {
    const { value, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      tags: checked 
        ? [...prev.tags, parseInt(value)]
        : prev.tags.filter(id => id !== parseInt(value))
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('date', formData.event_date);
      formDataToSend.append('time', formData.event_time);
      formDataToSend.append('location', formData.location);
      if (formData.category_id) {
        formDataToSend.append('category_id', formData.category_id);
      }
      if (formData.tags && formData.tags.length > 0) {
        formDataToSend.append('tags', JSON.stringify(formData.tags));
      }
      if (formData.rsvp_limit) {
        formDataToSend.append('rsvp_limit', formData.rsvp_limit);
      }
      formDataToSend.append('is_published', 'true');
      
      if (formData.cover_image) {
        formDataToSend.append('cover_image', formData.cover_image);
      }
      
      console.log('Sending update data:', {
        title: formData.title,
        description: formData.description,
        date: formData.event_date,
        time: formData.event_time,
        location: formData.location,
        category_id: formData.category_id,
        tags: formData.tags,
        rsvp_limit: formData.rsvp_limit
      });
      
      await api.put(`/events/${id}`, formDataToSend, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      alert('Event updated successfully!');
      navigate('/event-manager');
    } catch (error) {
      console.error('Failed to update event:', error);
      console.error('Error details:', error.response?.data);
      alert(`Failed to update event: ${error.response?.data?.error || error.message}`);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this event? This action cannot be undone.')) {
      try {
        await api.delete(`/events/${id}`);
        alert('Event deleted successfully!');
        navigate('/event-manager');
      } catch (error) {
        console.error('Failed to delete event:', error);
        alert('Failed to delete event. Please try again.');
      }
    }
  };

  if (loading) {
    return (
      <EditEventContainer>
        <LoadingContainer>
          <div className="spinner"></div>
          <p>Loading event details...</p>
        </LoadingContainer>
      </EditEventContainer>
    );
  }

  return (
    <>
      <ThemeBackground />
      <EditEventContainer style={{ position: 'relative', zIndex: 1 }}>
      <PageTitle className="animate-fade-in">Edit <span>Event</span></PageTitle>
      
      <FormContainer onSubmit={handleSubmit}>
        <FormGroup>
          <Label htmlFor="title">Event Title *</Label>
          <Input 
            type="text" 
            id="title" 
            name="title" 
            value={formData.title} 
            onChange={handleChange} 
            placeholder="Enter event title"
            required
          />
        </FormGroup>
        
        <FormGroup>
          <Label htmlFor="description">Description *</Label>
          <TextArea 
            id="description" 
            name="description" 
            value={formData.description} 
            onChange={handleChange} 
            placeholder="Describe your event"
            required
          />
        </FormGroup>
        
        <FormRow>
          <FormGroup>
            <Label htmlFor="event_date">Event Date *</Label>
            <Input 
              type="date" 
              id="event_date" 
              name="event_date" 
              value={formData.event_date} 
              onChange={handleChange}
              required
            />
          </FormGroup>
          
          <FormGroup>
            <Label htmlFor="event_time">Event Time *</Label>
            <Input 
              type="time" 
              id="event_time" 
              name="event_time" 
              value={formData.event_time} 
              onChange={handleChange}
              required
            />
          </FormGroup>
        </FormRow>
        
        <FormGroup>
          <Label htmlFor="location">Venue *</Label>
          <Input 
            type="text" 
            id="location" 
            name="location" 
            value={formData.location} 
            onChange={handleChange} 
            placeholder="Enter venue name"
            required
          />
        </FormGroup>
        
        <FormGroup>
          <Label htmlFor="rsvp_limit">RSVP Limit (Optional)</Label>
          <Input 
            type="number" 
            id="rsvp_limit" 
            name="rsvp_limit" 
            value={formData.rsvp_limit} 
            onChange={handleChange} 
            placeholder="Maximum attendees"
            min="1"
          />
        </FormGroup>
        
        <FormRow>
          <FormGroup>
            <Label htmlFor="category_id">Category</Label>
            <Select 
              id="category_id" 
              name="category_id" 
              value={formData.category_id} 
              onChange={handleChange}
            >
              <option value="">Select Category</option>
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </Select>
          </FormGroup>
          
          <FormGroup>
            <Label>Tags</Label>
            <TagsContainer>
              {tags.map(tag => (
                <TagLabel key={tag.id}>
                  <input
                    type="checkbox"
                    value={tag.id}
                    checked={formData.tags.includes(tag.id)}
                    onChange={handleTagChange}
                  />
                  {tag.name}
                </TagLabel>
              ))}
            </TagsContainer>
          </FormGroup>
        </FormRow>
        
        <FormGroup>
          <Label>Cover Image</Label>
          <CoverImageUpload
            onImageChange={(file) => setFormData(prev => ({ ...prev, cover_image: file }))}
          />
        </FormGroup>
        
        <ButtonGroup>
          <Button type="submit" className="primary">
            Update Event
          </Button>
          <Button type="button" className="secondary" onClick={() => navigate('/event-manager')}>
            Cancel
          </Button>
          <Button type="button" className="danger" onClick={handleDelete}>
            Delete Event
          </Button>
        </ButtonGroup>
      </FormContainer>
      </EditEventContainer>
    </>
  );
};

export default EditEvent;