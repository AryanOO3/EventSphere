import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Html5QrcodeScanner } from 'html5-qrcode';
import ThemeBackground from '../components/ThemeBackground';
import api from '../utils/api';
import { addNotification, createCheckInNotification } from '../utils/notifications';

const ScannerContainer = styled.div`
  max-width: 900px;
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

const ScannerBox = styled.div`
  background: rgba(255, 255, 255, 0.02);
  backdrop-filter: blur(20px);
  border-radius: var(--border-radius-lg);
  padding: 48px;
  box-shadow: var(--box-shadow-xl);
  border: 1px solid var(--border-color);
  margin-bottom: 32px;
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

const ScannerTitle = styled.h3`
  color: var(--text-primary);
  margin-bottom: 32px;
  font-size: 1.8rem;
  font-weight: 700;
  text-align: center;
  
  span {
    background: var(--gradient-primary);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  
  @media screen and (max-width: 768px) {
    font-size: 1.6rem;
    margin-bottom: 24px;
  }
`;

const ScannerWrapper = styled.div`
  #qr-reader {
    border-radius: var(--border-radius);
    overflow: hidden;
    box-shadow: var(--box-shadow);
    border: 2px solid var(--border-color);
    
    video {
      border-radius: var(--border-radius);
    }
    
    #qr-shaded-region {
      border-radius: var(--border-radius);
    }
  }
`;

const ResultBox = styled.div`
  background: ${props => props.success ? 
    'linear-gradient(135deg, #e8f5e8 0%, #c8e6c9 100%)' : 
    'linear-gradient(135deg, #ffebee 0%, #ffcdd2 100%)'
  };
  color: ${props => props.success ? '#2e7d32' : '#c62828'};
  border: 1px solid ${props => props.success ? '#66bb6a' : '#ef5350'};
  border-radius: var(--border-radius-lg);
  padding: 32px;
  margin-top: 32px;
  box-shadow: var(--box-shadow);
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: ${props => props.success ? 
      'linear-gradient(135deg, #4caf50 0%, #66bb6a 100%)' : 
      'linear-gradient(135deg, #f44336 0%, #ef5350 100%)'
    };
  }
  
  @media screen and (max-width: 768px) {
    padding: 24px;
  }
`;

const ResultTitle = styled.h4`
  font-size: 1.5rem;
  margin-bottom: 16px;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 12px;
  
  &::before {
    content: '${props => props.success ? '✅' : '❌'}';
    font-size: 1.8rem;
  }
  
  @media screen and (max-width: 768px) {
    font-size: 1.3rem;
  }
`;

const ResultMessage = styled.p`
  font-size: 1.1rem;
  margin-bottom: 16px;
  font-weight: 600;
  line-height: 1.6;
  
  @media screen and (max-width: 768px) {
    font-size: 1rem;
  }
`;

const UserInfo = styled.div`
  background: rgba(255, 255, 255, 0.3);
  padding: 20px;
  border-radius: var(--border-radius);
  margin-bottom: 20px;
  border: 1px solid rgba(255, 255, 255, 0.5);
  
  strong {
    font-weight: 700;
    margin-right: 8px;
  }
  
  p {
    margin: 8px 0;
    font-size: 1rem;
    font-weight: 500;
  }
  
  @media screen and (max-width: 768px) {
    padding: 16px;
    
    p {
      font-size: 0.95rem;
    }
  }
`;

const ResetButton = styled.button`
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
    width: 100%;
  }
`;

const InstructionsBox = styled.div`
  background: rgba(255, 255, 255, 0.02);
  backdrop-filter: blur(20px);
  border-radius: var(--border-radius);
  padding: 24px;
  margin-bottom: 32px;
  border: 1px solid var(--border-color);
  transition: var(--transition);
  
  h4 {
    color: var(--text-primary);
    margin-bottom: 16px;
    font-size: 1.3rem;
    font-weight: 700;
  }
  
  ul {
    list-style: none;
    padding: 0;
    margin: 0;
    
    li {
      color: var(--text-secondary);
      margin-bottom: 8px;
      font-weight: 500;
      display: flex;
      align-items: center;
      gap: 8px;
      
      &::before {
        content: '📱';
        font-size: 1.2rem;
      }
    }
  }
  
  @media screen and (max-width: 768px) {
    padding: 20px;
    
    h4 {
      font-size: 1.2rem;
    }
    
    ul li {
      font-size: 0.95rem;
    }
  }
`;

const QRScanner = () => {
  const [scanResult, setScanResult] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const scannerRef = React.useRef(null);

  const startScanner = () => {
    if (scannerRef.current) return;
    setIsScanning(true);
    
    setTimeout(() => {
      const onScanSuccess = async (decodedText) => {
        try {
          if (scannerRef.current) {
            scannerRef.current.clear();
            scannerRef.current = null;
          }
          setIsScanning(false);

          const response = await api.post('/qr/checkin', { qrData: decodedText });
          const eventTitle = response.data.event?.title || 'Event';
          addNotification(createCheckInNotification(eventTitle));
          
          setScanResult({
            success: true,
            message: `Successfully checked in: ${response.data.user.name}`,
            user: response.data.user,
            event: response.data.event
          });
        } catch (error) {
          setScanResult({
            success: false,
            message: error.response?.data?.error || 'Check-in failed',
            user: error.response?.data?.user || null
          });
        }
      };

      const onScanFailure = () => {};

      const scanner = new Html5QrcodeScanner(
        "qr-reader",
        { fps: 10, qrbox: { width: 250, height: 250 } },
        false
      );

      scanner.render(onScanSuccess, onScanFailure);
      scannerRef.current = scanner;
    }, 100);
  };

  const resetScanner = () => {
    setScanResult(null);
    setIsScanning(false);
    if (scannerRef.current) {
      scannerRef.current.clear();
      scannerRef.current = null;
    }
  };

  useEffect(() => {
    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear();
      }
    };
  }, []);

  return (
    <>
      <ThemeBackground />
      <ScannerContainer style={{ position: 'relative', zIndex: 1 }}>
      <PageTitle className="animate-fade-in">QR Code <span>Scanner</span></PageTitle>
      
      <InstructionsBox>
        <h4>How to use the QR Scanner:</h4>
        <ul>
          <li>Allow camera access when prompted</li>
          <li>Point your camera at the attendee's QR code</li>
          <li>Wait for the automatic scan and check-in</li>
          <li>View the check-in confirmation below</li>
        </ul>
      </InstructionsBox>
      
      <ScannerBox>
        <ScannerTitle>Scan QR Code for <span>Check-in</span></ScannerTitle>
        {!isScanning && !scanResult && (
          <div style={{ textAlign: 'center' }}>
            <ResetButton onClick={startScanner}>
              Start Camera
            </ResetButton>
          </div>
        )}
        {isScanning && (
          <ScannerWrapper>
            <div id="qr-reader"></div>
          </ScannerWrapper>
        )}
        
        {scanResult && (
          <ResultBox success={scanResult.success}>
            <ResultTitle success={scanResult.success}>
              {scanResult.success ? 'Check-in Successful!' : 'Check-in Failed'}
            </ResultTitle>
            <ResultMessage>{scanResult.message}</ResultMessage>
            {scanResult.user && (
              <UserInfo>
                <p><strong>Name:</strong> {scanResult.user.name}</p>
                <p><strong>Email:</strong> {scanResult.user.email}</p>
                {scanResult.event && (
                  <p><strong>Event:</strong> {scanResult.event.title}</p>
                )}
              </UserInfo>
            )}
            <ResetButton onClick={resetScanner}>
              Scan Another QR Code
            </ResetButton>
          </ResultBox>
        )}
      </ScannerBox>
      </ScannerContainer>
    </>
  );
};

export default QRScanner;