import React, { useContext, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { FaUserCircle, FaBars, FaTimes, FaSignOutAlt, FaCog, FaUser, FaBell } from 'react-icons/fa';
import { AuthContext } from '../context/AuthContext';
import NotificationBell from './NotificationBell';
import NotificationModal from './NotificationModal';
import DarkModeToggle from './DarkModeToggle';
import Logo from './Logo';

import { hasPermission, PERMISSIONS } from '../utils/rbac';

const NavigationBar = styled.nav`
  background-color: rgba(255, 255, 255, 0.02);
  backdrop-filter: blur(15px);
  box-shadow: var(--box-shadow);
  height: 80px;
  display: flex;
  justify-content: center;
  align-items: center;
  position: sticky;
  top: 0;
  z-index: 999;
`;

const NavWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  max-width: 1200px;
  padding: 0 20px;
`;

const BrandLink = styled(Link)`
  display: flex;
  align-items: center;
`;

const MobileMenuToggle = styled.div`
  display: none;
  font-size: 1.8rem;
  cursor: pointer;
  
  @media screen and (max-width: 960px) {
    display: block;
  }
`;

const NavigationMenu = styled.ul`
  display: flex;
  align-items: center;
  list-style: none;
  
  @media screen and (max-width: 960px) {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 90vh;
    position: absolute;
    top: 80px;
    left: ${({ $isOpen }) => ($isOpen ? '0' : '-100%')};
    opacity: 1;
    transition: all 0.5s ease;
    background: var(--bg-white);
    backdrop-filter: blur(15px);
    padding: 20px 0;
    box-shadow: var(--box-shadow-lg);
  }
`;

const MenuItem = styled.li`
  height: 80px;
  display: flex;
  align-items: center;
  
  @media screen and (max-width: 960px) {
    width: 100%;
    height: auto;
    padding: 15px 0;
    justify-content: center;
    border-bottom: 1px solid var(--border-color);
    
    &:last-child {
      border-bottom: none;
    }
  }
`;

const MenuLink = styled(Link)`
  color: var(--text-primary);
  display: flex;
  align-items: center;
  text-decoration: none;
  padding: 0 1rem;
  height: 100%;
  font-weight: 500;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    width: 0;
    height: 2px;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    background: var(--gradient-primary);
    transition: var(--transition);
  }
  
  &:hover {
    background: linear-gradient(135deg, #9B95FF 0%, #C490FF 50%, #E0A8FF 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    transition: var(--transition);
    
    &::after {
      width: 80%;
    }
  }
  
  @media screen and (max-width: 960px) {
    text-align: center;
    width: 100%;
    display: table;
    padding: 15px 20px;
    
    &::after {
      bottom: 5px;
    }
  }
`;

const ActionButton = styled.button`
  border-radius: var(--border-radius);
  background: ${({ $primary }) => ($primary ? 'var(--gradient-primary)' : 'transparent')};
  white-space: nowrap;
  padding: ${({ $big }) => ($big ? '14px 48px' : '12px 24px')};
  color: ${({ $primary }) => ($primary ? 'white' : 'var(--primary)')};
  font-size: ${({ $fontBig }) => ($fontBig ? '20px' : '16px')};
  font-weight: 600;
  outline: none;
  border: ${({ $primary }) => ($primary ? 'none' : '2px solid var(--border-color)')};
  cursor: pointer;
  transition: var(--transition);
  position: relative;
  overflow: hidden;
  box-shadow: ${({ $primary }) => ($primary ? 'var(--box-shadow)' : 'none')};
  
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
  }
  
  @media screen and (max-width: 960px) {
    width: 80%;
  }
`;

const ProfileDropdown = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 8px 12px;
  border-radius: var(--border-radius);
  transition: var(--transition);
  
  &:hover {
    background: var(--bg-light);
    transform: translateY(-1px);
    box-shadow: var(--box-shadow);
  }
`;

const DefaultAvatar = styled(FaUserCircle)`
  font-size: 2rem;
  background: var(--gradient-primary);
  color: transparent;
  background-clip: text;
  -webkit-background-clip: text;
  margin-right: 10px;
  transition: var(--transition);
  
  ${ProfileDropdown}:hover & {
    transform: scale(1.05);
  }
`;

const UserAvatar = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
  margin-right: 10px;
  transition: var(--transition);
  border: 2px solid var(--border-color);
  
  ${ProfileDropdown}:hover & {
    transform: scale(1.05);
  }
`;

const DisplayName = styled.span`
  font-weight: 700;
  background: var(--gradient-primary);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-size: 1rem;
  letter-spacing: 0.02em;
  
  @media screen and (max-width: 960px) {
    display: none;
  }
`;

const ProfileMenu = styled.div`
  display: ${({ $isOpen }) => ($isOpen ? 'block' : 'none')};
  position: absolute;
  top: 60px;
  right: 0;
  background: var(--bg-white);
  min-width: 180px;
  box-shadow: var(--box-shadow);
  border-radius: var(--border-radius);
  padding: 8px 0;
  z-index: 1000;
  border: 1px solid var(--border-color);
  
  @media screen and (max-width: 960px) {
    position: static;
    box-shadow: none;
    width: 100%;
    margin-top: 10px;
    border: none;
  }
`;

const ProfileMenuItem = styled.div`
  padding: 12px 20px;
  display: flex;
  align-items: center;
  color: var(--text-primary);
  font-weight: 500;
  transition: var(--transition);
  cursor: pointer;
  
  &:hover {
    background: var(--bg-light);
    color: var(--primary);
  }
  
  svg {
    margin-right: 10px;
    font-size: 1.2rem;
  }
`;



const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showNotificationModal, setShowNotificationModal] = useState(false);

  useEffect(() => {
    const handleOpenModal = () => setShowNotificationModal(true);
    window.addEventListener('openNotificationModal', handleOpenModal);
    return () => window.removeEventListener('openNotificationModal', handleOpenModal);
  }, []);
  const { currentUser, logout } = useContext(AuthContext);

  const navigate = useNavigate();
  const dropdownRef = React.useRef(null);
  
  const handleLogout = () => {
    logout();
    navigate('/');
    setDropdownOpen(false);
  };
  
  const toggleMenu = () => setIsOpen(!isOpen);
  
  const toggleDropdown = (e) => {
    e.stopPropagation();
    setDropdownOpen(!dropdownOpen);
  };
  
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  return (
    <NavigationBar>
      <NavWrapper>
        <BrandLink to="/">
          <Logo size="80px" />
        </BrandLink>
        <MobileMenuToggle onClick={toggleMenu}>
          {isOpen ? <FaTimes /> : <FaBars />}
        </MobileMenuToggle>
        <NavigationMenu $isOpen={isOpen}>
          <MenuItem>
            <MenuLink to="/" onClick={() => setIsOpen(false)}>Home</MenuLink>
          </MenuItem>
          <MenuItem>
            <MenuLink to="/events" onClick={() => setIsOpen(false)}>Events</MenuLink>
          </MenuItem>
          <MenuItem>
            <MenuLink to="/calendar" onClick={() => setIsOpen(false)}>Calendar</MenuLink>
          </MenuItem>

          {currentUser ? (
            <>
              <MenuItem>
                <MenuLink to="/dashboard" onClick={() => setIsOpen(false)}>Dashboard</MenuLink>
              </MenuItem>
              {hasPermission(currentUser.role, PERMISSIONS.CREATE_EVENTS) && (
                <MenuItem>
                  <MenuLink to="/create-event" onClick={() => setIsOpen(false)}>Create Event</MenuLink>
                </MenuItem>
              )}
              {currentUser.role === 'superadmin' && (
                <MenuItem>
                  <MenuLink to="/event-manager" onClick={() => setIsOpen(false)}>Event Manager</MenuLink>
                </MenuItem>
              )}

              <MenuItem>
                <ProfileDropdown ref={dropdownRef}>
                    <div onClick={toggleDropdown} style={{ display: 'flex', alignItems: 'center' }}>
                      {currentUser.profile_picture ? (
                        <UserAvatar 
                          src={currentUser.profile_picture.startsWith('/') ? 
                            `http://localhost:5000${currentUser.profile_picture}` : 
                            `http://localhost:5000/uploads/profiles/${currentUser.profile_picture}`
                          } 
                          alt="Profile"
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.nextSibling.style.display = 'block';
                          }}
                        />
                      ) : (
                        <DefaultAvatar />
                      )}
                      <DisplayName>{currentUser.name}</DisplayName>
                    </div>
                  <ProfileMenu $isOpen={dropdownOpen}>
                    <ProfileMenuItem as={Link} to="/profile" onClick={() => setDropdownOpen(false)}>
                      <FaUser />
                      My Profile
                    </ProfileMenuItem>


                    <ProfileMenuItem onClick={handleLogout}>
                      <FaSignOutAlt />
                      Sign Out
                    </ProfileMenuItem>
                  </ProfileMenu>
                </ProfileDropdown>
              </MenuItem>
            </>
          ) : (
            <>
              <MenuItem>
                <MenuLink to="/login" onClick={() => setIsOpen(false)}>Login</MenuLink>
              </MenuItem>
              <MenuItem>
                <ActionButton $primary onClick={() => navigate('/register')}>Sign Up</ActionButton>
              </MenuItem>
            </>
          )}
        </NavigationMenu>
        <NotificationBell />
      </NavWrapper>
      <NotificationModal 
        isOpen={showNotificationModal} 
        onClose={() => setShowNotificationModal(false)} 
      />
    </NavigationBar>
  );
};

export default Navbar;