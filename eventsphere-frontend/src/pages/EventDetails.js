import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import api from '../utils/api';
import RsvpButtons from '../components/RsvpButtons';
import FileUpload from '../components/FileUpload';
import ThemeBackground from '../components/ThemeBackground';
import { AuthContext } from '../context/AuthContext';

const PageWrapper = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 80px 40px;
  min-height: 100vh;
  overflow: hidden;
  
  @media screen and (max-width: 1024px) {
    padding: 60px 24px;
  }
  
  @media screen and (max-width: 768px) {
    padding: 40px 16px;
  }
`;

const NavigationButton = styled.button`
  background: rgba(255, 255, 255, 0.02);
  backdrop-filter: blur(20px);
  border: 2px solid var(--border-color);
  color: var(--text-primary);
  padding: 12px 24px;
  border-radius: var(--border-radius);
  cursor: pointer;
  margin-bottom: 32px;
  font-weight: 600;
  transition: var(--transition);
  box-shadow: var(--box-shadow);
  position: relative;
  overflow: hidden;
  outline: none;
  
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
    background: var(--gradient-primary);
    color: white;
    border-color: transparent;
    transform: translateY(-2px);
    box-shadow: var(--box-shadow-lg);
    outline: none;
  }
`;

const HeroImage = styled.img`
  width: 100%;
  height: 500px;
  object-fit: cover;
  border-radius: var(--border-radius-lg);
  margin-bottom: 48px;
  box-shadow: var(--box-shadow-xl);
  border: 1px solid var(--border-color);
  transition: var(--transition);
  
  &:hover {
    transform: scale(1.02);
  }
  
  @media screen and (max-width: 768px) {
    height: 300px;
    margin-bottom: 32px;
  }
`;

const MainTitle = styled.h1`
  font-size: 3.5rem;
  margin-bottom: 48px;
  color: var(--text-primary);
  font-weight: 800;
  letter-spacing: -0.02em;
  text-align: center;
  position: relative;
  
  @media screen and (max-width: 1024px) {
    font-size: 2.8rem;
    margin-bottom: 40px;
  }
  
  @media screen and (max-width: 768px) {
    font-size: 2.2rem;
    margin-bottom: 32px;
  }
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 24px;
  margin-bottom: 48px;
  padding: 32px;
  background: rgba(255, 255, 255, 0.02);
  backdrop-filter: blur(20px);
  border-radius: var(--border-radius-lg);
  box-shadow: var(--box-shadow-lg);
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
    border-radius: var(--border-radius-lg) var(--border-radius-lg) 0 0;
  }
  
  @media screen and (max-width: 768px) {
    grid-template-columns: 1fr;
    padding: 24px;
    gap: 20px;
  }
`;

const InfoCard = styled.div`
  text-align: center;
  padding: 20px;
  background: var(--bg-light);
  border-radius: var(--border-radius);
  transition: var(--transition);
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: var(--box-shadow);
  }
  
  strong {
    color: var(--text-primary);
    display: block;
    margin-bottom: 8px;
    font-size: 1rem;
    font-weight: 700;
  }
  
  span {
    font-size: 1.2rem;
    color: var(--text-primary);
    font-weight: 600;
  }
`;

const DescriptionSection = styled.div`
  background: rgba(255, 255, 255, 0.02);
  backdrop-filter: blur(20px);
  padding: 32px;
  border-radius: var(--border-radius-lg);
  box-shadow: var(--box-shadow);
  border: 1px solid var(--border-color);
  color: var(--text-primary);
  line-height: 1.8;
  margin-bottom: 48px;
  font-size: 1.1rem;
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
    border-radius: var(--border-radius-lg) var(--border-radius-lg) 0 0;
  }
`;

const TagsContainer = styled.div`
  background: rgba(255, 255, 255, 0.02);
  backdrop-filter: blur(20px);
  padding: 32px;
  border-radius: var(--border-radius-lg);
  box-shadow: var(--box-shadow);
  border: 1px solid var(--border-color);
  margin-bottom: 48px;
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
    border-radius: var(--border-radius-lg) var(--border-radius-lg) 0 0;
  }
`;

const TagsHeading = styled.h3`
  color: var(--text-primary);
  margin-bottom: 24px;
  font-size: 1.5rem;
  font-weight: 700;
`;

const TagsWrapper = styled.div`
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
`;

const TagItem = styled.span`
  background: var(--primary);
  color: white;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 600;
  box-shadow: var(--box-shadow);
  transition: var(--transition);
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: var(--box-shadow-lg);
  }
`;

const StatsSection = styled.div`
  background: rgba(255, 255, 255, 0.02);
  backdrop-filter: blur(20px);
  padding: 32px;
  border-radius: var(--border-radius-lg);
  margin-bottom: 48px;
  box-shadow: var(--box-shadow-lg);
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
    border-radius: var(--border-radius-lg) var(--border-radius-lg) 0 0;
  }
`;

const StatsHeading = styled.h3`
  color: var(--text-primary);
  margin-bottom: 24px;
  font-size: 1.5rem;
  font-weight: 700;
  text-align: center;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 24px;
  
  span {
    text-align: center;
    padding: 20px;
    background: var(--bg-light);
    border-radius: var(--border-radius);
    color: var(--text-secondary);
    font-size: 1rem;
    font-weight: 600;
    transition: var(--transition);
    
    &:hover {
      transform: translateY(-4px);
      box-shadow: var(--box-shadow);
    }
    
    strong {
      display: block;
      color: var(--primary);
      font-size: 2rem;
      margin-bottom: 8px;
    }
  }
`;

const PhotoGallery = styled.div`
  margin-bottom: 30px;
`;

const DocumentsSection = styled.div`
  margin-bottom: 30px;
`;

const DocumentsHeading = styled.h3`
  color: var(--text-primary);
  margin-bottom: 15px;
`;

const DocumentsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const DocumentItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 15px;
  background: var(--bg-light);
  border-radius: var(--border-radius);
  border: 1px solid var(--border-color);
  transition: var(--transition);
  
  &:hover {
    background: var(--bg-white);
    box-shadow: var(--box-shadow);
  }
`;

const DocumentInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
  
  .file-icon {
    font-size: 1.5rem;
  }
  
  .file-details {
    .file-name {
      font-weight: 500;
      color: var(--text-primary);
      margin-bottom: 2px;
    }
    
    .file-size {
      font-size: 0.9rem;
      color: var(--text-secondary);
    }
  }
`;

const DocumentActions = styled.div`
  display: flex;
  gap: 10px;
  
  button {
    padding: 8px 12px;
    border: none;
    border-radius: var(--border-radius);
    cursor: pointer;
    font-size: 0.9rem;
    transition: var(--transition);
    
    &.download {
      background: var(--primary);
      color: white;
      
      &:hover {
        background: var(--primary-dark);
      }
    }
    
    &.delete {
      background: #fee;
      color: #d32f2f;
      
      &:hover {
        background: #ffcdd2;
      }
    }
  }
`;

const UploadArea = styled.div`
  margin-bottom: 20px;
  padding: 20px;
  background: var(--bg-white);
  border-radius: var(--border-radius);
  border: 1px solid var(--border-color);
`;

const GalleryHeading = styled.h3`
  color: var(--text-primary);
  margin-bottom: 15px;
`;

const UploadPrompt = styled.div`
  width: 100%;
  height: 200px;
  border: 2px dashed var(--border-color);
  border-radius: var(--border-radius);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: var(--transition);
  margin-bottom: 15px;
  break-inside: avoid;
  
  &:hover {
    border-color: var(--primary);
    background: var(--bg-light);
  }
  
  span {
    font-size: 3rem;
    color: var(--text-secondary);
  }
`;

const UploadModal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
`;

const ModalBody = styled.div`
  background: var(--bg-white);
  padding: 30px;
  border-radius: var(--border-radius);
  max-width: 90vw;
  max-height: 90vh;
  text-align: center;
  position: relative;
  overflow-y: auto;
  
  .preview-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 15px;
    margin-bottom: 20px;
    
    img {
      width: 100%;
      height: 120px;
      object-fit: cover;
      border-radius: var(--border-radius);
    }
  }
  
  button {
    background: var(--primary);
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: var(--border-radius);
    cursor: pointer;
    margin: 0 10px;
    
    &:hover {
      background: var(--primary-dark);
    }
  }
`;

const PhotoModal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1001;
  padding: 20px;
`;

const PhotoModalBody = styled.div`
  position: relative;
  background: var(--bg-white);
  border-radius: var(--border-radius);
  padding: 20px;
  max-width: 80vw;
  max-height: 80vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  
  img {
    max-width: 100%;
    max-height: 60vh;
    object-fit: contain;
    border-radius: var(--border-radius);
  }
  
  .modal-header {
    position: absolute;
    top: 15px;
    right: 15px;
    display: flex;
    gap: 10px;
  }
  
  .close-btn, .delete-btn {
    width: 36px;
    height: 36px;
    border-radius: 8px;
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 16px;
    transition: var(--transition);
  }
  
  .close-btn {
    background: var(--bg-light);
    color: var(--text-primary);
    
    &:hover {
      background: var(--border-color);
    }
  }
  
  .delete-btn {
    background: #fee;
    color: #d32f2f;
    
    &:hover {
      background: #ffcdd2;
    }
  }
`;

const PhotoGrid = styled.div`
  columns: 3;
  column-gap: 15px;
  
  @media (max-width: 768px) {
    columns: 2;
  }
  
  @media (max-width: 480px) {
    columns: 1;
  }
`;

const PhotoCard = styled.div`
  position: relative;
  border-radius: var(--border-radius);
  overflow: hidden;
  box-shadow: var(--box-shadow);
  margin-bottom: 15px;
  break-inside: avoid;
  cursor: pointer;
  transition: transform 0.2s ease;
  
  &:hover {
    transform: scale(1.02);
  }
  
  img {
    width: 100%;
    height: auto;
    display: block;
  }
  
  button {
    position: absolute;
    top: 5px;
    right: 5px;
    background: rgba(244, 67, 54, 0.8);
    color: white;
    border: none;
    border-radius: 50%;
    width: 25px;
    height: 25px;
    cursor: pointer;
    font-size: 12px;
  }
`;

const EventDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser, loading: authLoading } = useContext(AuthContext);
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !currentUser) {
      navigate('/login');
      return;
    }
  }, [currentUser, authLoading, navigate]);
  const [images, setImages] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [eventFiles, setEventFiles] = useState([]);
  const [uploadFiles, setUploadFiles] = useState([]);
  const [clearUpload, setClearUpload] = useState(false);
  const [attendanceStats, setAttendanceStats] = useState({ going: 0, notGoing: 0, checkedIn: 0 });

  const isAdmin = currentUser && (currentUser.role === 'admin' || currentUser.role === 'superadmin');

  useEffect(() => {
    fetchEvent();
    fetchImages();
    fetchFiles();
    if (isAdmin) {
      fetchAttendanceStats();
    }
  }, [id, isAdmin]);

  const fetchEvent = async () => {
    try {
      const response = await api.get(`/events/${id}`);
      setEvent(response.data.event);
    } catch (error) {
      console.error('Failed to fetch event:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAttendanceStats = async () => {
    try {
      const response = await api.get(`/events/${id}/attendance`);
      setAttendanceStats(response.data);
    } catch (error) {
      console.error('Failed to fetch attendance stats:', error);
    }
  };

  const fetchImages = async () => {
    try {
      const response = await api.get(`/events/${id}`);
      const files = response.data.event?.files || [];
      const imageFiles = files.filter(file => file.file_type?.startsWith('image/') && file.file_type !== 'image/cover');
      setImages(imageFiles.map(file => ({
        id: file.filename,
        image_path: `http://localhost:5000${file.file_path}`
      })));
    } catch (error) {
      setImages([]);
    }
  };

  const fetchFiles = async () => {
    try {
      const response = await api.get(`/events/${id}`);
      const files = response.data.event?.files || [];
      const nonImageFiles = files.filter(file => !file.file_type?.startsWith('image/') || file.file_type === 'image/cover');
      setEventFiles(nonImageFiles.map(file => ({
        id: file.id,
        name: file.original_name,
        size: 0,
        type: file.file_type,
        url: `http://localhost:5000${file.file_path}`
      })));
    } catch (error) {
      setEventFiles([]);
    }
  };

  const handleAddImageClick = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.multiple = true;
    input.onchange = (e) => {
      const files = Array.from(e.target.files);
      if (files.length > 0) {
        setSelectedFiles(files);
        setPreviewUrls(files.map(file => URL.createObjectURL(file)));
        setShowModal(true);
      }
    };
    input.click();
  };

  const handleImageUpload = async () => {
    if (selectedFiles.length === 0) return;
    
    try {
      const formData = new FormData();
      selectedFiles.forEach(file => {
        formData.append('files', file);
      });
      
      await api.post(`/events/${id}/files`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      await fetchImages();
      setSelectedFiles([]);
      setPreviewUrls([]);
      setShowModal(false);
    } catch (error) {
      alert('Failed to upload images.');
    }
  };

  const handleModalClose = () => {
    setShowModal(false);
    setSelectedFiles([]);
    setPreviewUrls([]);
  };

  const handleImageDelete = async (imageId) => {
    try {
      await api.delete(`/events/${id}/files/${imageId}`);
      setImages(prev => prev.filter(img => img.id !== imageId));
    } catch (error) {
      console.error('Failed to delete image:', error);
      alert('Failed to delete image');
    }
  };

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

  const handleFileUpload = async () => {
    if (uploadFiles.length === 0) return;
    
    try {
      const formData = new FormData();
      uploadFiles.forEach(file => {
        formData.append('files', file);
      });
      
      await api.post(`/events/${id}/files`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      await fetchFiles();
      setUploadFiles([]);
      setClearUpload(true);
      setTimeout(() => setClearUpload(false), 100);
    } catch (error) {
      console.error('Upload error:', error.response?.data || error.message);
      alert(`Failed to upload files: ${error.response?.data?.error || error.message}`);
    }
  };

  const handleFileDelete = async (fileId) => {
    try {
      const file = eventFiles.find(f => f.id === fileId);
      if (file) {
        const filename = file.url.split('/').pop();
        await api.delete(`/events/${id}/files/${filename}`);
        setEventFiles(prev => prev.filter(f => f.id !== fileId));
      }
    } catch (error) {
      console.error('Failed to delete file:', error);
      alert('Failed to delete file');
    }
  };

  const handleFileDownload = (fileItem) => {

    const link = document.createElement('a');
    link.href = fileItem.url;
    link.download = fileItem.name;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (authLoading) return <PageWrapper>Loading...</PageWrapper>;
  if (!currentUser) return null;
  if (loading) return <PageWrapper>Loading...</PageWrapper>;
  if (!event) return <PageWrapper>Event not found</PageWrapper>;

  return (
    <>
      <ThemeBackground />
      <PageWrapper style={{ position: 'relative', zIndex: 1 }}>
      <NavigationButton onClick={() => navigate(-1)}>← Back</NavigationButton>
      
      {event.cover_image && (
        <HeroImage 
          src={`http://localhost:5000${event.cover_image}`} 
          alt={event.title}
        />
      )}
      
      <MainTitle>{event.title}</MainTitle>
      
      <InfoGrid>
        <InfoCard>
          <strong>📅 Date</strong>
          <span>{new Date(event.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
        </InfoCard>
        <InfoCard>
          <strong>🕐 Time</strong>
          <span>{event.time || 'Time not specified'}</span>
        </InfoCard>
        <InfoCard>
          <strong>📍 Location</strong>
          <span>{event.location}</span>
        </InfoCard>
        <InfoCard>
          <strong>🏷️ Category</strong>
          <span>{event.category_name || event.category || 'No category'}</span>
        </InfoCard>
      </InfoGrid>
      
      {event.tags && event.tags.length > 0 && (
        <TagsContainer>
          <TagsHeading>Tags</TagsHeading>
          <TagsWrapper>
            {event.tags.map((tag, index) => (
              <TagItem key={`tag-${index}`}>{tag}</TagItem>
            ))}
          </TagsWrapper>
        </TagsContainer>
      )}
      
      {isAdmin && (
        <StatsSection>
          <StatsHeading>Event Attendance</StatsHeading>
          <StatsGrid>
            <span>✅ <strong>{attendanceStats.going}</strong> Going</span>
            <span>❌ <strong>{attendanceStats.notGoing}</strong> Not Going</span>
            <span>🎯 <strong>{attendanceStats.checkedIn}</strong> Checked In</span>
          </StatsGrid>
        </StatsSection>
      )}
      
      <DescriptionSection>
        {event.description}
      </DescriptionSection>
      
      <RsvpButtons eventId={event.id} />
      
      {(eventFiles.length > 0 || isAdmin) && (
        <DocumentsSection>
          <DocumentsHeading>Event Files</DocumentsHeading>
          
          {isAdmin && (
            <UploadArea>
              <h4 style={{ marginBottom: '15px', color: 'var(--text-primary)' }}>Upload Files</h4>
              <FileUpload onFilesChange={setUploadFiles} clearFiles={clearUpload} />
              {uploadFiles.length > 0 && (
                <button 
                  onClick={handleFileUpload}
                  style={{
                    marginTop: '15px',
                    background: 'var(--primary)',
                    color: 'white',
                    border: 'none',
                    padding: '10px 20px',
                    borderRadius: 'var(--border-radius)',
                    cursor: 'pointer'
                  }}
                >
                  Upload Files ({uploadFiles.length})
                </button>
              )}
            </UploadArea>
          )}
          
          {eventFiles.length > 0 && (
            <DocumentsList>
              {eventFiles.map((file, index) => (
                <DocumentItem key={`file-${file.id || index}`}>
                  <DocumentInfo>
                    <span className="file-icon">{getFileIcon(file.name)}</span>
                    <div className="file-details">
                      <div className="file-name">{file.name}</div>
                      <div className="file-size">{formatFileSize(file.size)}</div>
                    </div>
                  </DocumentInfo>
                  <DocumentActions>
                    <button 
                      className="download"
                      onClick={() => handleFileDownload(file)}
                    >
                      Download
                    </button>
                    {isAdmin && (
                      <button 
                        className="delete"
                        onClick={() => handleFileDelete(file.id)}
                      >
                        Delete
                      </button>
                    )}
                  </DocumentActions>
                </DocumentItem>
              ))}
            </DocumentsList>
          )}
        </DocumentsSection>
      )}
      
      {(images.length > 0 || isAdmin) && (
        <PhotoGallery>
          <GalleryHeading>Event Gallery</GalleryHeading>
          
          {isAdmin && (
            <UploadPrompt onClick={handleAddImageClick}>
              <span>+</span>
            </UploadPrompt>
          )}
          
          <PhotoGrid>
            {images.map((image, index) => (
              <PhotoCard key={`image-${image.id || index}`}>
                <img 
                  src={image.image_path} 
                  alt="Event" 
                  onClick={() => setSelectedImage(image)}
                />
                {isAdmin && (
                  <button onClick={(e) => {
                    e.stopPropagation();
                    handleImageDelete(image.id);
                  }}>×</button>
                )}
              </PhotoCard>
            ))}
          </PhotoGrid>
          
          {showModal && (
            <UploadModal onClick={handleModalClose}>
              <ModalBody onClick={(e) => e.stopPropagation()}>
                <h3>Preview Images ({selectedFiles.length})</h3>
                <div className="preview-grid">
                  {previewUrls.map((url, index) => (
                    <img key={`preview-${index}`} src={url} alt={`Preview ${index + 1}`} />
                  ))}
                </div>
                <div>
                  <button onClick={handleImageUpload}>Upload All</button>
                  <button onClick={handleModalClose}>Cancel</button>
                </div>
              </ModalBody>
            </UploadModal>
          )}
          
          {selectedImage && (
            <PhotoModal onClick={() => setSelectedImage(null)}>
              <PhotoModalBody onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                  {isAdmin && (
                    <button 
                      className="delete-btn" 
                      onClick={() => {
                        handleImageDelete(selectedImage.id);
                        setSelectedImage(null);
                      }}
                      title="Delete Image"
                    >🗑️</button>
                  )}
                  <button 
                    className="close-btn" 
                    onClick={() => setSelectedImage(null)}
                    title="Close"
                  >✕</button>
                </div>
                <img src={selectedImage.image_path} alt="Event" />
              </PhotoModalBody>
            </PhotoModal>
          )}
        </PhotoGallery>
      )}
      </PageWrapper>
    </>
  );
};

export default EventDetails;