import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

const UploadArea = styled.div`
  border: 2px dashed ${props => props.$isDragOver ? 'var(--primary)' : '#ddd'};
  border-radius: var(--border-radius);
  padding: 40px 20px;
  text-align: center;
  background-color: ${props => props.$isDragOver ? 'rgba(var(--primary-rgb), 0.1)' : 'var(--bg-light)'};
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    border-color: var(--primary);
    background-color: rgba(var(--primary-rgb), 0.05);
  }
`;

const ImagePreview = styled.div`
  text-align: center;
  margin-top: 15px;
`;

const CoverPreview = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-radius: var(--border-radius);
  border: 1px solid var(--border-color);
`;

const DimensionsInfo = styled.div`
  margin: 10px 0;
  font-size: 0.9rem;
  color: var(--text-secondary);
`;

const DeleteButton = styled.button`
  background: #dc3545;
  color: white;
  border: none;
  padding: 5px 10px;
  border-radius: var(--border-radius);
  cursor: pointer;
  margin-top: 10px;
  
  &:hover {
    background: #a71e2a;
  }
`;

const FileInput = styled.input`
  display: none;
`;

const CoverImageUpload = ({ onImageChange }) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [imageDimensions, setImageDimensions] = useState(null);

  useEffect(() => {
    if (selectedImage) {
      const url = URL.createObjectURL(selectedImage);
      setImageUrl(url);
      
      const img = new Image();
      img.onload = () => {
        setImageDimensions({ width: img.width, height: img.height });
      };
      img.src = url;
      
      return () => {
        URL.revokeObjectURL(url);
      };
    } else {
      setImageUrl(null);
      setImageDimensions(null);
    }
  }, [selectedImage]);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files[0] && files[0].type.startsWith('image/')) {
      setSelectedImage(files[0]);
      onImageChange(files[0]);
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedImage(file);
      onImageChange(file);
    }
  };

  const handleRemove = () => {
    setSelectedImage(null);
    setImageUrl(null);
    onImageChange(null);
  };

  const handleClick = () => {
    document.getElementById('cover-image-input').click();
  };

  return (
    <div>
      {!selectedImage ? (
        <UploadArea
          $isDragOver={isDragOver}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={handleClick}
        >
          <p>Drag & drop cover image here or click to browse</p>
          <p style={{ fontSize: '0.8rem', marginTop: '5px', color: 'var(--text-secondary)' }}>
            Recommended dimensions: 1920x1080 (16:9 aspect ratio)
          </p>
        </UploadArea>
      ) : (
        <ImagePreview>
          <CoverPreview 
            src={imageUrl} 
            alt="Cover preview"
          />
          {imageDimensions && (
            <DimensionsInfo>
              Dimensions: {imageDimensions.width} × {imageDimensions.height}px
            </DimensionsInfo>
          )}
          <div>
            <DeleteButton onClick={handleRemove}>Remove Image</DeleteButton>
          </div>
        </ImagePreview>
      )}
      
      <FileInput
        id="cover-image-input"
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
      />
    </div>
  );
};

export default CoverImageUpload;