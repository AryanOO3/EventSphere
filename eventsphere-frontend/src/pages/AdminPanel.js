import React, { useState, useEffect, useContext } from 'react';
import styled from 'styled-components';
import { AuthContext } from '../context/AuthContext';
import ThemeBackground from '../components/ThemeBackground';
import api from '../utils/api';

const AdminContainer = styled.div`
  max-width: 1200px;
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

const Section = styled.div`
  background: rgba(255, 255, 255, 0.02);
  backdrop-filter: blur(20px);
  border-radius: var(--border-radius-lg);
  padding: 48px;
  margin-bottom: 32px;
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
    margin-bottom: 24px;
  }
`;

const SectionTitle = styled.h2`
  color: var(--text-primary);
  margin-bottom: 32px;
  font-size: 2rem;
  font-weight: 700;
  text-align: center;
  
  span {
    background: var(--gradient-primary);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  
  @media screen and (max-width: 768px) {
    font-size: 1.8rem;
    margin-bottom: 24px;
  }
`;

const Form = styled.form`
  display: flex;
  gap: 16px;
  margin-bottom: 32px;
  
  @media screen and (max-width: 768px) {
    flex-direction: column;
    gap: 12px;
  }
`;

const Input = styled.input`
  flex: 1;
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
  background: var(--gradient-primary);
  color: white;
  border: none;
  padding: 16px 32px;
  border-radius: var(--border-radius);
  cursor: pointer;
  font-weight: 700;
  font-size: 1.1rem;
  transition: var(--transition);
  position: relative;
  overflow: hidden;
  box-shadow: var(--box-shadow-lg);
  outline: none !important;
  white-space: nowrap;
  
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
    outline: none !important;
  }
  
  &:focus {
    outline: none !important;
  }
  
  @media screen and (max-width: 768px) {
    padding: 14px 28px;
    font-size: 1rem;
  }
`;

const ItemList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  
  @media screen and (max-width: 768px) {
    gap: 8px;
  }
`;

const Item = styled.span`
  background: rgba(255, 255, 255, 0.02);
  backdrop-filter: blur(20px);
  padding: 12px 20px;
  border-radius: 25px;
  border: 2px solid var(--border-color);
  font-weight: 600;
  color: var(--text-primary);
  transition: var(--transition);
  box-shadow: var(--box-shadow);
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: var(--gradient-primary);
    transform: scaleX(0);
    transition: transform 0.3s ease;
  }
  
  &:hover {
    background: var(--bg-white);
    border-color: var(--primary);
    transform: translateY(-2px);
    box-shadow: var(--box-shadow-lg);
    
    &::before {
      transform: scaleX(1);
    }
  }
  
  @media screen and (max-width: 768px) {
    padding: 10px 16px;
    font-size: 0.95rem;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 48px 24px;
  color: var(--text-secondary);
  font-size: 1.1rem;
  font-weight: 500;
  background: rgba(255, 255, 255, 0.02);
  backdrop-filter: blur(20px);
  border-radius: var(--border-radius);
  border: 2px dashed var(--border-color);
  
  .icon {
    font-size: 3rem;
    margin-bottom: 16px;
    opacity: 0.7;
  }
  
  @media screen and (max-width: 768px) {
    padding: 32px 16px;
    font-size: 1rem;
    
    .icon {
      font-size: 2.5rem;
    }
  }
`;

const AdminPanel = () => {
  const { currentUser } = useContext(AuthContext);
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [newCategory, setNewCategory] = useState('');
  const [newTag, setNewTag] = useState('');

  useEffect(() => {
    if (currentUser?.role === 'admin' || currentUser?.role === 'superadmin') {
      fetchCategories();
      fetchTags();
    }
  }, [currentUser]);

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

  const handleCreateCategory = async (e) => {
    e.preventDefault();
    if (!newCategory.trim()) return;
    
    try {
      await api.post('/categories', { name: newCategory });
      setNewCategory('');
      fetchCategories();
    } catch (error) {
      console.error('Failed to create category:', error);
    }
  };

  const handleCreateTag = async (e) => {
    e.preventDefault();
    if (!newTag.trim()) return;
    
    try {
      await api.post('/tags', { name: newTag });
      setNewTag('');
      fetchTags();
    } catch (error) {
      console.error('Failed to create tag:', error);
    }
  };

  if (currentUser?.role !== 'admin' && currentUser?.role !== 'superadmin') {
    return <div>Access denied. Admin privileges required.</div>;
  }

  return (
    <>
      <ThemeBackground />
      <AdminContainer style={{ position: 'relative', zIndex: 1 }}>
      <PageTitle className="animate-fade-in">Admin <span>Panel</span></PageTitle>
      
      <Section>
        <SectionTitle>Manage <span>Categories</span></SectionTitle>
        <Form onSubmit={handleCreateCategory}>
          <Input
            type="text"
            placeholder="Enter category name"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
          />
          <Button type="submit">Add Category</Button>
        </Form>
        
        {categories.length > 0 ? (
          <ItemList>
            {categories.map(category => (
              <Item key={category.id}>{category.name}</Item>
            ))}
          </ItemList>
        ) : (
          <EmptyState>
            <div className="icon">📂</div>
            <div>No categories created yet. Add your first category above!</div>
          </EmptyState>
        )}
      </Section>

      <Section>
        <SectionTitle>Manage <span>Tags</span></SectionTitle>
        <Form onSubmit={handleCreateTag}>
          <Input
            type="text"
            placeholder="Enter tag name"
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
          />
          <Button type="submit">Add Tag</Button>
        </Form>
        
        {tags.length > 0 ? (
          <ItemList>
            {tags.map(tag => (
              <Item key={tag.id}>{tag.name}</Item>
            ))}
          </ItemList>
        ) : (
          <EmptyState>
            <div className="icon">🏷️</div>
            <div>No tags created yet. Add your first tag above!</div>
          </EmptyState>
        )}
      </Section>
      </AdminContainer>
    </>
  );
};

export default AdminPanel;