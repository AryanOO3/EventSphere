import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import api from '../utils/api';

const FiltersWrapper = styled.div`
  background: rgba(255, 255, 255, 0.02);
  backdrop-filter: blur(20px);
  padding: 32px;
  border-radius: var(--border-radius-lg);
  box-shadow: var(--box-shadow-lg);
  margin-bottom: 48px;
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
    padding: 24px;
    margin-bottom: 32px;
  }
`;

const FiltersHeading = styled.h3`
  margin-bottom: 24px;
  color: var(--text-primary);
  font-size: 1.4rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 8px;
  
  &::before {
    content: '🔍';
    font-size: 1.2rem;
  }
  
  @media screen and (max-width: 768px) {
    font-size: 1.2rem;
    margin-bottom: 20px;
  }
`;

const FiltersRow = styled.div`
  display: flex;
  gap: 32px;
  flex-wrap: wrap;
  align-items: flex-start;
  
  @media screen and (max-width: 1024px) {
    gap: 24px;
  }
  
  @media screen and (max-width: 768px) {
    flex-direction: column;
    gap: 20px;
  }
`;

const DropdownSelect = styled.select`
  padding: 12px 16px;
  border: 2px solid var(--border-color);
  border-radius: var(--border-radius);
  font-size: 14px;
  min-width: 180px;
  background: var(--bg-white);
  color: var(--text-primary);
  font-weight: 500;
  transition: var(--transition);
  cursor: pointer;
  
  &:focus {
    outline: none;
    border-color: var(--primary);
    box-shadow: 0 0 0 3px rgba(108, 99, 255, 0.1);
  }
  
  &:hover {
    border-color: var(--primary);
  }
`;

const FilterColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  
  @media screen and (max-width: 768px) {
    width: 100%;
  }
`;

const FieldLabel = styled.label`
  font-weight: 600;
  color: var(--text-primary);
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 6px;
`;





const ResetButton = styled.button`
  padding: 12px 24px;
  background: var(--bg-light);
  color: var(--text-primary);
  border: 2px solid var(--border-color);
  border-radius: var(--border-radius);
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  transition: var(--transition);
  position: relative;
  overflow: hidden;
  outline: none !important;
  
  &:focus {
    outline: none !important;
  }
  
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
    background: var(--danger);
    color: white;
    border-color: var(--danger);
    transform: translateY(-2px);
    box-shadow: var(--box-shadow-lg);
    outline: none !important;
  }
`;

const EventFilters = ({ onFilterChange }) => {
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);

  useEffect(() => {
    fetchCategories();
    fetchTags();
  }, []);

  useEffect(() => {
    onFilterChange({
      category: selectedCategory,
      tags: selectedTags
    });
  }, [selectedCategory, selectedTags, onFilterChange]);

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



  const clearFilters = () => {
    setSelectedCategory('');
    setSelectedTags([]);
  };

  return (
    <FiltersWrapper>
      <FiltersHeading>Filter Events</FiltersHeading>
      <FiltersRow>
        <FilterColumn>
          <FieldLabel>📂 Category</FieldLabel>
          <DropdownSelect 
            value={selectedCategory} 
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="">All Categories</option>
            {categories.map(category => (
              <option key={category.id} value={category.name}>
                {category.name}
              </option>
            ))}
          </DropdownSelect>
        </FilterColumn>
        
        <FilterColumn>
          <FieldLabel>🏷️ Tags</FieldLabel>
          <DropdownSelect 
            value={selectedTags.length > 0 ? selectedTags[0] : ''} 
            onChange={(e) => setSelectedTags(e.target.value ? [e.target.value] : [])}
          >
            <option value="">All Tags</option>
            {tags.map(tag => (
              <option key={tag.id} value={tag.name}>
                {tag.name}
              </option>
            ))}
          </DropdownSelect>
        </FilterColumn>
        
        <ResetButton onClick={clearFilters}>
          Clear Filters
        </ResetButton>
      </FiltersRow>
    </FiltersWrapper>
  );
};

export default EventFilters;