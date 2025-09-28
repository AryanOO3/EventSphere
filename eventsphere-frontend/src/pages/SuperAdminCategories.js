import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import ThemeBackground from '../components/ThemeBackground';
import api from '../utils/api';
import { addNotification, createAdminTaskNotification } from '../utils/notifications';

const Container = styled.div`
  max-width: 1400px;
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
  font-size: 2.8rem;
  color: var(--text-primary);
  margin-bottom: 16px;
  font-weight: 800;
  letter-spacing: -0.02em;
  text-align: center;
  
  span {
    background: var(--gradient-primary);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  
  @media screen and (max-width: 768px) {
    font-size: 2.2rem;
  }
  
  @media screen and (max-width: 480px) {
    font-size: 1.8rem;
  }
`;

const PageSubtitle = styled.p`
  color: var(--text-secondary);
  font-size: 1.1rem;
  text-align: center;
  margin-bottom: 48px;
  
  @media screen and (max-width: 768px) {
    margin-bottom: 32px;
  }
`;

const SectionsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 32px;
  
  @media screen and (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 24px;
  }
`;

const Section = styled.div`
  background: rgba(255, 255, 255, 0.02);
  backdrop-filter: blur(20px);
  border-radius: var(--border-radius-lg);
  padding: 48px;
  box-shadow: var(--box-shadow-lg);
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
    border-radius: var(--border-radius-lg) var(--border-radius-lg) 0 0;
  }
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: var(--box-shadow-xl);
  }
  
  @media screen and (max-width: 768px) {
    padding: 32px 24px;
  }
`;

const SectionTitle = styled.h2`
  background: var(--gradient-primary);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 32px;
  font-size: 1.8rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 12px;
  
  &::before {
    content: '${props => props.icon || '🏷️'}';
    font-size: 1.5rem;
  }
  
  @media screen and (max-width: 768px) {
    font-size: 1.5rem;
    margin-bottom: 24px;
  }
`;

const AddForm = styled.div`
  display: flex;
  gap: 16px;
  margin-bottom: 32px;
  
  @media screen and (max-width: 640px) {
    flex-direction: column;
    gap: 12px;
  }
  
  input {
    flex: 1;
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
  }
  
  button {
    background: var(--gradient-primary);
    color: white;
    border: none;
    padding: 16px 32px;
    border-radius: var(--border-radius);
    cursor: pointer;
    font-weight: 600;
    font-size: 16px;
    transition: var(--transition);
    position: relative;
    overflow: hidden;
    min-width: 140px;
    
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
    
    @media screen and (max-width: 640px) {
      width: 100%;
    }
  }
`;

const ItemsList = styled.div`
  display: grid;
  gap: 16px;
`;

const Item = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  background: rgba(255, 255, 255, 0.02);
  backdrop-filter: blur(20px);
  border-radius: var(--border-radius);
  border: 1px solid var(--border-color);
  transition: var(--transition);
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: var(--box-shadow);
    background: var(--bg-white);
  }
  
  span {
    font-weight: 600;
    color: var(--text-primary);
    font-size: 16px;
  }
  
  button {
    background: #dc3545;
    color: white;
    border: none;
    padding: 8px 16px;
    border-radius: var(--border-radius);
    cursor: pointer;
    font-size: 14px;
    font-weight: 600;
    transition: var(--transition);
    position: relative;
    overflow: hidden;
    
    &:hover {
      transform: translateY(-2px) scale(1.05);
      box-shadow: 0 8px 25px rgba(220, 53, 69, 0.4);
      background: #c82333;
    }
  }
  
  @media screen and (max-width: 640px) {
    flex-direction: column;
    gap: 12px;
    text-align: center;
    
    button {
      width: 100%;
    }
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 48px 24px;
  color: var(--text-secondary);
  
  .icon {
    font-size: 3rem;
    margin-bottom: 16px;
    opacity: 0.5;
  }
  
  h3 {
    font-size: 1.2rem;
    margin-bottom: 8px;
    color: var(--text-primary);
  }
  
  p {
    font-size: 1rem;
  }
`;

const SuperAdminCategories = () => {
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [newCategory, setNewCategory] = useState('');
  const [newTag, setNewTag] = useState('');

  useEffect(() => {
    fetchCategories();
    fetchTags();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await api.get('/categories');
      setCategories(response.data.categories || []);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  };

  const fetchTags = async () => {
    try {
      const response = await api.get('/tags');
      setTags(response.data.tags || []);
    } catch (error) {
      console.error('Failed to fetch tags:', error);
    }
  };

  const addCategory = async () => {
    if (!newCategory.trim()) return;
    
    try {
      await api.post('/categories', { name: newCategory });
      setNewCategory('');
      fetchCategories();
      
      addNotification(createAdminTaskNotification('Category Added', `New category "${newCategory}" has been created`));
    } catch (error) {
      console.error('Failed to add category:', error);
      alert('Failed to add category');
    }
  };

  const addTag = async () => {
    if (!newTag.trim()) return;
    
    try {
      await api.post('/tags', { name: newTag });
      setNewTag('');
      fetchTags();
      
      addNotification(createAdminTaskNotification('Tag Added', `New tag "${newTag}" has been created`));
    } catch (error) {
      console.error('Failed to add tag:', error);
      alert('Failed to add tag');
    }
  };

  const deleteCategory = async (id) => {
    if (!window.confirm('Are you sure you want to delete this category?')) return;
    
    try {
      const category = categories.find(c => c.id === id);
      const response = await api.delete(`/categories/${id}`);
      
      if (response.status === 200) {
        fetchCategories();
        addNotification(createAdminTaskNotification('Category Deleted', `Category "${category?.name}" has been removed`));
      }
    } catch (error) {
      console.error('Failed to delete category:', error);
      const errorMessage = error.response?.data?.error || error.response?.data?.message || 'Failed to delete category';
      alert(errorMessage);
    }
  };

  const deleteTag = async (id) => {
    if (!window.confirm('Are you sure you want to delete this tag?')) return;
    
    try {
      const tag = tags.find(t => t.id === id);
      const response = await api.delete(`/tags/${id}`);
      
      if (response.status === 200) {
        fetchTags();
        addNotification(createAdminTaskNotification('Tag Deleted', `Tag "${tag?.name}" has been removed`));
      }
    } catch (error) {
      console.error('Failed to delete tag:', error);
      const errorMessage = error.response?.data?.error || error.response?.data?.message || 'Failed to delete tag';
      alert(errorMessage);
    }
  };

  return (
    <>
      <ThemeBackground />
      <Container style={{ position: 'relative', zIndex: 1 }}>
      <PageTitle>
        Categories & <span>Tags Management</span>
      </PageTitle>
      <PageSubtitle>
        Organize your events with categories and tags for better discoverability
      </PageSubtitle>
      
      <SectionsGrid>
        <Section>
          <SectionTitle icon="📂">Categories ({categories.length})</SectionTitle>
          <AddForm>
            <input
              type="text"
              placeholder="Enter new category name"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addCategory()}
            />
            <button onClick={addCategory}>Add Category</button>
          </AddForm>
          
          <ItemsList>
            {categories.map(category => (
              <Item key={category.id}>
                <span>{category.name}</span>
                <button onClick={() => deleteCategory(category.id)}>Delete</button>
              </Item>
            ))}
            {categories.length === 0 && (
              <EmptyState>
                <div className="icon">📂</div>
                <h3>No categories yet</h3>
                <p>Add your first category above to get started</p>
              </EmptyState>
            )}
          </ItemsList>
        </Section>

        <Section>
          <SectionTitle icon="🏷️">Tags ({tags.length})</SectionTitle>
          <AddForm>
            <input
              type="text"
              placeholder="Enter new tag name"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addTag()}
            />
            <button onClick={addTag}>Add Tag</button>
          </AddForm>
          
          <ItemsList>
            {tags.map(tag => (
              <Item key={tag.id}>
                <span>{tag.name}</span>
                <button onClick={() => deleteTag(tag.id)}>Delete</button>
              </Item>
            ))}
            {tags.length === 0 && (
              <EmptyState>
                <div className="icon">🏷️</div>
                <h3>No tags yet</h3>
                <p>Add your first tag above to get started</p>
              </EmptyState>
            )}
          </ItemsList>
        </Section>
      </SectionsGrid>
      </Container>
    </>
  );
};

export default SuperAdminCategories;