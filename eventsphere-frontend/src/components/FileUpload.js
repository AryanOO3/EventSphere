import React, { useState } from 'react';
import styled from 'styled-components';

const UploadZone = styled.div`
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

const FilesContainer = styled.div`
  margin-top: 15px;
`;

const FileCard = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px;
  background: var(--bg-light);
  border-radius: var(--border-radius);
  margin-bottom: 10px;
  border: 1px solid var(--border-color);
`;

const FileDetails = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  
  .file-icon {
    font-size: 1.2rem;
  }
  
  .file-details {
    .file-name {
      font-weight: 500;
      color: var(--text-primary);
    }
    
    .file-size {
      font-size: 0.8rem;
      color: var(--text-secondary);
    }
  }
`;

const DeleteButton = styled.button`
  background: #dc3545;
  color: white;
  border: none;
  padding: 5px 10px;
  border-radius: var(--border-radius);
  cursor: pointer;
  font-size: 0.8rem;
  
  &:hover {
    background: #a71e2a;
  }
`;

const FileInput = styled.input`
  display: none;
`;

const FileUpload = ({ onFilesChange, multiple = true, clearFiles = false }) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);

  React.useEffect(() => {
    if (clearFiles) {
      setSelectedFiles([]);
      onFilesChange([]);
    }
  }, [clearFiles, onFilesChange]);

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (fileName) => {
    const ext = fileName.split('.').pop().toLowerCase();
    if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext)) return '🖼️';
    if (['pdf'].includes(ext)) return '📄';
    if (['doc', 'docx'].includes(ext)) return '📝';
    if (['xls', 'xlsx'].includes(ext)) return '📊';
    if (['zip', 'rar', '7z'].includes(ext)) return '📦';
    return '📎';
  };

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
    if (files.length > 0) {
      const newFiles = multiple ? [...selectedFiles, ...files] : [files[0]];
      setSelectedFiles(newFiles);
      onFilesChange(newFiles);
    }
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      const newFiles = multiple ? [...selectedFiles, ...files] : [files[0]];
      setSelectedFiles(newFiles);
      onFilesChange(newFiles);
    }
  };

  const handleRemoveFile = (index) => {
    const newFiles = selectedFiles.filter((_, i) => i !== index);
    setSelectedFiles(newFiles);
    onFilesChange(newFiles);
  };

  const handleClick = () => {
    document.getElementById('file-upload-input').click();
  };

  return (
    <div>
      <UploadZone
        $isDragOver={isDragOver}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
      >
        <p>Drag & drop files here or click to browse</p>
        <p style={{ fontSize: '0.8rem', marginTop: '5px', color: 'var(--text-secondary)' }}>
          {multiple ? 'Multiple files supported' : 'Single file only'}
        </p>
      </UploadZone>
      
      {selectedFiles.length > 0 && (
        <FilesContainer>
          {selectedFiles.map((file, index) => (
            <FileCard key={index}>
              <FileDetails>
                <span className="file-icon">{getFileIcon(file.name)}</span>
                <div className="file-details">
                  <div className="file-name">{file.name}</div>
                  <div className="file-size">{formatFileSize(file.size)}</div>
                </div>
              </FileDetails>
              <DeleteButton onClick={() => handleRemoveFile(index)}>
                Remove
              </DeleteButton>
            </FileCard>
          ))}
        </FilesContainer>
      )}
      
      <FileInput
        id="file-upload-input"
        type="file"
        multiple={multiple}
        onChange={handleFileSelect}
      />
    </div>
  );
};

export default FileUpload;