import React, { useState, useRef } from 'react';
import styled from 'styled-components';
import { FaCamera, FaUser } from 'react-icons/fa';
import api from '../utils/api';

const UploadWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 30px;
`;

const AvatarContainer = styled.div`
  position: relative;
  width: 200px;
  height: 200px;
  border-radius: 50%;
  overflow: hidden;
  border: 4px solid var(--primary);
  cursor: pointer;
  
  &:hover .overlay {
    opacity: 1;
  }
`;

const AvatarImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const PlaceholderAvatar = styled.div`
  width: 100%;
  height: 100%;
  background-color: var(--bg-light);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 5rem;
  color: var(--text-secondary);
`;

const HoverOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s;
  color: white;
  font-size: 2rem;
`;

const FileInput = styled.input`
  display: none;
`;

const SaveButton = styled.button`
  background-color: var(--primary);
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: var(--border-radius);
  margin-top: 10px;
  cursor: pointer;
  font-size: 0.9rem;
  
  &:hover {
    background-color: var(--primary-dark);
  }
  
  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`;

const ProfilePictureUpload = ({ currentUser, onUpdate }) => {
  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }
      
      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        alert('File size must be less than 5MB');
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (e) => setPreview(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = async () => {
    const file = fileInputRef.current.files[0];
    if (!file || uploading) return;

    const formData = new FormData();
    formData.append('profilePicture', file);

    try {
      setUploading(true);
      
      // Check if user is authenticated
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Please log in again');
        return;
      }
      
      const response = await api.post('/users/profile/picture', formData, {
        headers: { 
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.data && response.data.user) {
        onUpdate(response.data.user);
        setPreview(null);
        fileInputRef.current.value = '';
        alert('Profile picture updated successfully!');
      }
    } catch (error) {
      console.error('Upload failed:', error);
      
      if (error.response?.status === 401) {
        alert('Session expired. Please log in again.');
        localStorage.clear();
        window.location.href = '/login';
      } else if (error.response?.status === 413) {
        alert('File too large. Please choose a smaller image.');
      } else {
        const errorMessage = error.response?.data?.error || error.response?.data?.message || 'Upload failed. Please try again.';
        alert(errorMessage);
      }
    } finally {
      setUploading(false);
    }
  };

  const profileImageSrc = preview || (currentUser?.profile_picture ? `http://localhost:5000${currentUser.profile_picture}` : null);

  return (
    <UploadWrapper>
      <AvatarContainer onClick={() => fileInputRef.current?.click()}>
        {profileImageSrc ? (
          <AvatarImage src={profileImageSrc} alt="Profile" />
        ) : (
          <PlaceholderAvatar>
            <FaUser />
          </PlaceholderAvatar>
        )}
        <HoverOverlay className="overlay">
          <FaCamera />
        </HoverOverlay>
      </AvatarContainer>
      
      <FileInput
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
      />
      
      {preview && (
        <SaveButton onClick={handleUpload} disabled={uploading}>
          {uploading ? 'Uploading...' : 'Save Picture'}
        </SaveButton>
      )}
    </UploadWrapper>
  );
};

export default ProfilePictureUpload;