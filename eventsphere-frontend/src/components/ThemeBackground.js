import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

const BackgroundWrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  pointer-events: none;
  z-index: 0;
  overflow: hidden;
  background: linear-gradient(135deg, #000000 0%, #0a0a0a 50%, #1a1a2e 100%);
  will-change: transform;
  transform: translateZ(0);
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(135deg, #d4edff 0%, #e8f4ff 50%, #f8fcff 100%);
    opacity: 1;
    clip-path: circle(150% at calc(100vw - 160px) calc(100vh - 50px));
    transition: clip-path 1s ease-in-out;
    will-change: clip-path;
    transform: translateZ(0);
  }
  
  @keyframes float {
    0%, 100% { transform: translate3d(0, 0px, 0); opacity: 0.6; }
    50% { transform: translate3d(0, -8px, 0); opacity: 1; }
  }
  
  @media (max-width: 768px) {
    &::before {
      clip-path: circle(150% at calc(100vw - 30px) calc(100vh - 30px));
    }
    
    [data-theme="dark"] &::before {
      clip-path: circle(0% at calc(100vw - 30px) calc(100vh - 30px));
    }
  }
  
  [data-theme="dark"] &::before {
    clip-path: circle(0% at calc(100vw - 60px) calc(100vh - 50px));
  }
  
  @keyframes driftRight {
    0% { transform: translate3d(0px, 0px, 0) scale(0.8); }
    100% { transform: translate3d(calc(100vw + 300px), 0px, 0) scale(1); }
  }
  
  @keyframes driftLeft {
    0% { transform: translate3d(0px, 0px, 0) scale(0.9); }
    100% { transform: translate3d(calc(-100vw - 300px), 0px, 0) scale(1); }
  }
  
  @keyframes shine {
    0% { opacity: 0; transform: scale(0.5); }
    20% { opacity: 1; transform: scale(1.5); }
    40% { opacity: 0; transform: scale(0.5); }
    100% { opacity: 0; transform: scale(0.5); }
  }
  
  @keyframes shootingStar {
    0% { transform: translate3d(-200px, -200px, 0) rotate(45deg) scale(0); opacity: 0; }
    5% { opacity: 1; transform: translate3d(-150px, -150px, 0) rotate(45deg) scale(1); }
    95% { opacity: 0.8; }
    100% { transform: translate3d(calc(100vw + 200px), calc(100vh + 200px), 0) rotate(45deg) scale(0); opacity: 0; }
  }
`;

const ShootingStar = styled.div`
  position: absolute;
  width: 3px;
  height: 3px;
  background: #ffffff;
  border-radius: 50%;
  box-shadow: 0 0 15px #ffffff, 0 0 30px #87ceeb;
  animation: shootingStar ${props => props.$duration}s linear infinite;
  animation-delay: ${props => props.$delay}s;
  animation-play-state: var(--animation-play-state, running);
  top: ${props => props.$top}%;
  left: ${props => props.$left}%;
  opacity: 0;
  will-change: transform, opacity;
  transform: translateZ(0);
  
  &::before {
    content: '';
    position: absolute;
    width: ${props => props.$trailLength}px;
    height: 3px;
    background: linear-gradient(135deg, transparent, rgba(255,255,255,0.9), rgba(255,255,255,0.7), rgba(135,206,235,0.5), rgba(255,255,255,0.3), transparent);
    top: 0;
    left: -${props => props.$trailLength}px;
    border-radius: 2px;
    box-shadow: 0 0 8px rgba(255,255,255,0.4), 0 0 16px rgba(135,206,235,0.3);
  }
`;

const Star = styled.div`
  position: absolute;
  width: 3px;
  height: 3px;
  background: ${props => props.$color};
  border-radius: 50%;
  box-shadow: 0 0 6px ${props => props.$color};
  top: ${props => props.$top}%;
  left: ${props => props.$left}%;
  animation: shine ${props => props.$duration}s ease-in-out infinite;
  animation-delay: ${props => props.$delay}s;
  animation-play-state: var(--animation-play-state, running);
  will-change: transform, opacity;
  transform: translateZ(0);
`;

const Cloud = styled.div`
  position: absolute;
  top: ${props => props.$top}%;
  left: ${props => props.$direction === 'right' ? '-300px' : 'calc(100vw + 300px)'};
  opacity: ${props => props.$opacity};
  animation: ${props => props.$direction === 'right' ? 'driftRight' : 'driftLeft'} ${props => props.$duration}s linear infinite;
  animation-delay: ${props => props.$delay}s;
  animation-play-state: var(--animation-play-state, running);
  will-change: transform;
  transform: translateZ(0);
  
  &::before {
    content: '';
    position: absolute;
    width: ${props => props.$size}px;
    height: ${props => props.$size * 0.6}px;
    background: #ffffff;
    border-radius: 50px;
    box-shadow: 
      ${props => props.$size * 0.3}px 0 0 -${props => props.$size * 0.1}px #ffffff,
      -${props => props.$size * 0.3}px 0 0 -${props => props.$size * 0.1}px #ffffff,
      0 -${props => props.$size * 0.2}px 0 -${props => props.$size * 0.05}px #ffffff,
      0 2px 8px rgba(0, 0, 0, 0.1);
  }
  
  &::after {
    content: '';
    position: absolute;
    width: ${props => props.$size * 0.7}px;
    height: ${props => props.$size * 0.4}px;
    background: #ffffff;
    border-radius: 30px;
    top: ${props => props.$size * 0.1}px;
    left: ${props => props.$size * 0.15}px;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
  }
`;

const FloatingOrb = styled.div`
  position: fixed;
  bottom: 50px;
  right: 60px;
  width: 12px;
  height: 12px;
  background: radial-gradient(circle, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.5) 50%, transparent 100%);
  border-radius: 50%;
  animation: float 3s ease-in-out infinite;
  animation-play-state: var(--animation-play-state, running);
  pointer-events: none;
  z-index: 10;
  will-change: transform;
  transform: translateZ(0);
  
  @media (max-width: 768px) {
    bottom: 30px;
    right: 30px;
    width: 8px;
    height: 8px;
  }
  
  [data-theme="dark"] & {
    background: radial-gradient(circle, rgba(168,85,247,0.9) 0%, rgba(168,85,247,0.5) 50%, transparent 100%);
  }
`;

const ThemeBackground = () => {
  const [stars, setStars] = useState([]);
  
  const generateStars = () => Array.from({ length: 30 }, () => ({
    top: Math.random() * 95,
    left: Math.random() * 95,
    color: ['#fbbf24', '#a855f7', '#06b6d4', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6', '#ffffff'][Math.floor(Math.random() * 8)],
    duration: 3 + Math.random() * 2,
    delay: Math.random() * 5
  }));
  
  useEffect(() => {
    setStars(generateStars());
    const interval = setInterval(() => {
      setStars(generateStars());
    }, 8000);
    return () => clearInterval(interval);
  }, []);
  
  const [shootingStars] = useState(() => Array.from({ length: 18 }, (_, i) => {
    const duration = 3 + Math.random() * 4;
    return {
      id: `star-${i}-${Date.now()}`,
      top: Math.random() * 80,
      left: Math.random() * 80,
      delay: Math.random() * 30,
      duration,
      trailLength: Math.floor(40 + (7 - duration) * 15)
    };
  }));
  
  const [clouds] = useState(() => Array.from({ length: 20 }, (_, i) => ({
    id: `cloud-${i}-${Date.now()}`,
    top: Math.random() * 90,
    size: 80 + Math.random() * 100,
    opacity: 0.4 + Math.random() * 0.4,
    direction: Math.random() > 0.5 ? 'right' : 'left',
    duration: 15 + Math.random() * 20,
    delay: i * 1.5,
    shape: Math.random()
  })));
  
  const [isDark, setIsDark] = useState(document.documentElement.getAttribute('data-theme') === 'dark');
  const [isTransitioning, setIsTransitioning] = useState(false);
  
  useEffect(() => {
    const observer = new MutationObserver(() => {
      const newTheme = document.documentElement.getAttribute('data-theme') === 'dark';
      if (newTheme !== isDark) {
        setIsTransitioning(true);
        // Pause animations during transition
        document.body.style.setProperty('--animation-play-state', 'paused');
        
        setTimeout(() => {
          setIsDark(newTheme);
          // Resume animations after theme change
          document.body.style.setProperty('--animation-play-state', 'running');
        }, 100);
        
        setTimeout(() => setIsTransitioning(false), 1600);
      }
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    return () => observer.disconnect();
  }, [isDark]);
  
  return (
    <>
    <FloatingOrb />
    <BackgroundWrapper>
      {isDark ? (
        <>
          {stars.map((star, index) => (
            <Star key={index} $top={star.top} $left={star.left} $color={star.color} $duration={star.duration} $delay={star.delay} />
          ))}
          {shootingStars.map((star) => (
            <ShootingStar key={star.id} $top={star.top} $left={star.left} $duration={star.duration} $delay={star.delay} $trailLength={star.trailLength} />
          ))}
        </>
      ) : (
        <>
          {clouds.map((cloud) => (
            <Cloud key={cloud.id} $top={cloud.top} $size={cloud.size} $opacity={cloud.opacity} $direction={cloud.direction} $duration={cloud.duration} $delay={cloud.delay} />
          ))}
        </>
      )}
    </BackgroundWrapper>
    </>
  );
};

export default ThemeBackground;