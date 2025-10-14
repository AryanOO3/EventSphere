import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FaMoon, FaSun } from 'react-icons/fa';

const ThemeToggleWrapper = styled.div`
  position: fixed;
  bottom: 30px;
  right: 30px;
  z-index: 997;
  cursor: pointer;
`;

const SwitchTrack = styled.div`
  width: 80px;
  height: 40px;
  border-radius: 25px;
  background: ${props => props.$isDark ? 'linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%)' : 'linear-gradient(135deg, #87ceeb 0%, #38bdf8 50%, #0ea5e9 100%)'};
  position: relative;
  transition: all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
  box-shadow: ${props => props.$isDark 
    ? 'inset 0 2px 15px rgba(0,0,0,0.5), 0 0 20px rgba(99, 102, 241, 0.3), 0 4px 15px rgba(0,0,0,0.2)' 
    : 'inset 0 2px 15px rgba(0,0,0,0.1), 0 0 20px rgba(14, 165, 233, 0.3), 0 4px 15px rgba(135,206,235,0.3)'
  };
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: -20px;
    left: -20px;
    right: -20px;
    bottom: -20px;
    border-radius: 50%;
    background: ${props => props.$isDark 
      ? 'conic-gradient(from 0deg, #6366f1, #8b5cf6, #a855f7, #6366f1)'
      : 'conic-gradient(from 0deg, #0ea5e9, #38bdf8, #7dd3fc, #0ea5e9)'
    };
    animation: ${props => props.$isDark ? 'rotateBorderDark 4s linear infinite' : 'rotateBorderLight 3s linear infinite'};
    z-index: -1;
  }
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    border-radius: 25px;
    background: ${props => props.$isDark 
      ? 'radial-gradient(circle at 20% 50%, rgba(99, 102, 241, 0.2) 0%, transparent 50%)' 
      : 'radial-gradient(circle at 80% 50%, rgba(255,255,255,0.4) 0%, transparent 50%)'
    };
    transition: all 0.6s ease;
  }
  
  &:hover {
    transform: scale(1.08) rotate(${props => props.$isDark ? '2deg' : '-2deg'});
    box-shadow: ${props => props.$isDark 
      ? 'inset 0 2px 15px rgba(0,0,0,0.5), 0 0 30px rgba(99, 102, 241, 0.5), 0 6px 20px rgba(0,0,0,0.3)' 
      : 'inset 0 2px 15px rgba(0,0,0,0.1), 0 0 30px rgba(14, 165, 233, 0.5), 0 6px 20px rgba(135,206,235,0.4)'
    };
  }
  
  @keyframes rotateBorderLight {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
  
  @keyframes rotateBorderDark {
    from { transform: rotate(0deg); }
    to { transform: rotate(-360deg); }
  }
`;

const SwitchHandle = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: ${props => props.$isDark 
    ? 'radial-gradient(circle at 30% 30%, #e2e8f0, #cbd5e1)'
    : 'radial-gradient(circle at 30% 30%, #fbbf24, #f59e0b)'
  };
  position: absolute;
  top: 4px;
  left: ${props => props.$isDark ? '44px' : '4px'};
  transition: all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
  box-shadow: ${props => props.$isDark 
    ? '0 0 0 2px #6366f1, 0 0 15px rgba(99, 102, 241, 0.4), 0 4px 12px rgba(0,0,0,0.2)' 
    : '0 0 0 2px #f59e0b, 0 0 25px rgba(251, 191, 36, 0.6), 0 4px 12px rgba(0,0,0,0.1)'
  };
  display: flex;
  align-items: center;
  justify-content: center;
  transform: ${props => props.$isDark ? 'rotate(170deg)' : 'rotate(0deg)'};
  
  &::before {
    content: '';
    position: absolute;
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background: ${props => props.$isDark 
      ? 'conic-gradient(from 0deg, rgba(255,255,255,0.1), transparent, rgba(99, 102, 241, 0.2), transparent)'
      : 'conic-gradient(from 0deg, rgba(255,255,255,0.3), transparent, rgba(251, 191, 36, 0.3), transparent)'
    };
    animation: ${props => props.$isDark ? 'moonShimmer 6s linear infinite' : 'sunShimmer 4s linear infinite'};
  }
  
  svg {
    font-size: 1.1rem;
    color: ${props => props.$isDark ? '#1e293b' : '#ffffff'};
    z-index: 1;
    transition: all 0.4s ease;
    filter: ${props => props.$isDark 
      ? 'drop-shadow(0 0 6px rgba(30, 41, 59, 0.8))' 
      : 'drop-shadow(0 0 8px rgba(255, 255, 255, 0.8))'
    };
    transform: ${props => props.$isDark ? 'rotate(180deg)' : 'rotate(0deg)'};
  }
  
  @keyframes sunShimmer {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
  
  @keyframes moonShimmer {
    from { transform: rotate(0deg); }
    to { transform: rotate(-360deg); }
  }
  
  @keyframes sunSpin {
    0%, 100% { transform: rotate(0deg) scale(1); }
    50% { transform: rotate(180deg) scale(1.1); }
  }
  
  @keyframes moonBob {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-2px); }
  }
`;

const NightStars = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  opacity: ${props => props.$isDark ? 1 : 0};
  transition: opacity 0.6s ease;
  border-radius: 25px;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: 
      radial-gradient(1px 1px at 10px 8px, #fff, transparent),
      radial-gradient(1px 1px at 25px 15px, #a855f7, transparent),
      radial-gradient(1px 1px at 45px 12px, #06b6d4, transparent),
      radial-gradient(1px 1px at 65px 20px, #10b981, transparent),
      radial-gradient(1px 1px at 15px 25px, #f59e0b, transparent),
      radial-gradient(1px 1px at 35px 30px, #ec4899, transparent),
      radial-gradient(1px 1px at 55px 8px, #8b5cf6, transparent);
    background-size: 80px 40px;
    animation: ${props => props.$isDark ? 'twinkleStars 4s ease-in-out infinite' : 'none'};
  }
  
  &::after {
    content: '🌟';
    position: absolute;
    top: 5px;
    right: 8px;
    font-size: 12px;
    animation: ${props => props.$isDark ? 'sparkle 3s ease-in-out infinite' : 'none'};
  }
  
  @keyframes twinkleStars {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.6; }
  }
  
  @keyframes sparkle {
    0%, 100% { opacity: 0.8; transform: scale(1) rotate(0deg); }
    50% { opacity: 1; transform: scale(1.2) rotate(180deg); }
  }
`;

const DayClouds = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  opacity: ${props => props.$isDark ? 0 : 1};
  transition: opacity 0.5s ease;
  border-radius: 25px;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: 
      radial-gradient(circle at 15px 10px, rgba(255,255,255,0.4) 2px, transparent 3px),
      radial-gradient(circle at 35px 15px, rgba(255,255,255,0.3) 3px, transparent 4px),
      radial-gradient(circle at 55px 12px, rgba(255,255,255,0.5) 2px, transparent 3px),
      radial-gradient(circle at 25px 25px, rgba(255,255,255,0.3) 2px, transparent 3px),
      radial-gradient(circle at 45px 28px, rgba(255,255,255,0.4) 3px, transparent 4px);
    animation: ${props => props.$isDark ? 'none' : 'floatClouds 6s ease-in-out infinite'};
  }
  
  &::after {
    content: '☀️';
    position: absolute;
    top: 8px;
    left: 8px;
    font-size: 10px;
    animation: ${props => props.$isDark ? 'none' : 'sunGlow 4s ease-in-out infinite'};
  }
  
  @keyframes floatClouds {
    0%, 100% { transform: translateX(0px) translateY(0px); }
    33% { transform: translateX(2px) translateY(-1px); }
    66% { transform: translateX(-1px) translateY(1px); }
  }
  
  @keyframes sunGlow {
    0%, 100% { opacity: 0.8; transform: scale(1); }
    50% { opacity: 1; transform: scale(1.1); }
  }
`;

const DarkModeToggle = () => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('darkMode');
    if (savedTheme === 'true') {
      setIsDark(true);
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.setAttribute('data-theme', 'light');
    }
  }, []);

  const toggleDarkMode = () => {
    const newDarkMode = !isDark;
    setIsDark(newDarkMode);
    localStorage.setItem('darkMode', newDarkMode.toString());
    document.documentElement.setAttribute('data-theme', newDarkMode ? 'dark' : 'light');
  };

  return (
    <ThemeToggleWrapper onClick={toggleDarkMode}>
      <SwitchTrack $isDark={isDark}>
        <NightStars $isDark={isDark} />
        <DayClouds $isDark={isDark} />
        <SwitchHandle $isDark={isDark}>
          {isDark ? <FaMoon /> : <FaSun />}
        </SwitchHandle>
      </SwitchTrack>
    </ThemeToggleWrapper>
  );
};

export default DarkModeToggle;