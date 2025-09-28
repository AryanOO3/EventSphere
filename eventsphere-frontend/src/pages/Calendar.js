import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import ThemeBackground from '../components/ThemeBackground';
import api from '../utils/api';

const CalendarWrapper = styled.div`
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

const HeaderSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 48px;
  background: rgba(255, 255, 255, 0.05);
  padding: 32px;
  border-radius: var(--border-radius-lg);
  box-shadow: var(--box-shadow-lg);
  border: 1px solid rgba(155, 149, 255, 0.3);
  position: relative;
  overflow: hidden;
  backdrop-filter: blur(15px);
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
    flex-direction: column;
    gap: 20px;
    padding: 24px;
  }
`;

const DateControls = styled.div`
  display: flex;
  gap: 16px;
  align-items: center;
  background: var(--bg-light);
  padding: 16px 20px;
  border-radius: var(--border-radius);
  border: 1px solid var(--border-color);
  
  @media screen and (max-width: 768px) {
    flex-direction: column;
    gap: 12px;
    padding: 12px 16px;
  }
`;

const DateDropdown = styled.select`
  padding: 10px 14px;
  border: 2px solid var(--border-color);
  border-radius: var(--border-radius);
  background: var(--bg-white);
  color: var(--text-primary);
  font-weight: 600;
  font-size: 0.95rem;
  cursor: pointer;
  transition: var(--transition);
  outline: none !important;
  min-width: 120px;
  box-shadow: var(--box-shadow);
  
  &:focus {
    border: 2px solid transparent;
    background: linear-gradient(var(--bg-white), var(--bg-white)) padding-box, var(--gradient-primary) border-box;
    box-shadow: 0 0 0 3px rgba(108, 99, 255, 0.1);
    outline: none !important;
    transform: translateY(-1px);
  }
  
  &:hover {
    border: 2px solid transparent;
    background: linear-gradient(var(--bg-white), var(--bg-white)) padding-box, var(--gradient-primary) border-box;
    transform: translateY(-1px);
    box-shadow: var(--box-shadow-lg);
  }
  
  @media screen and (max-width: 768px) {
    min-width: 100px;
    font-size: 0.9rem;
  }
`;

const CalendarTitle = styled.h1`
  font-size: 2.5rem;
  color: var(--text-primary);
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
    font-size: 2rem;
  }
  
  @media screen and (max-width: 480px) {
    font-size: 1.8rem;
  }
`;

const MonthNavigator = styled.button`
  background: var(--gradient-primary);
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: var(--border-radius);
  cursor: pointer;
  font-size: 1rem;
  font-weight: 600;
  transition: var(--transition);
  position: relative;
  overflow: hidden;
  box-shadow: var(--box-shadow);
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
    box-shadow: var(--box-shadow-lg);
    outline: none !important;
  }
  
  &:focus {
    outline: none !important;
  }
`;

const CalendarLayout = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 2px;
  background: rgba(155, 149, 255, 0.02);
  border-radius: var(--border-radius-lg);
  overflow: hidden;
  box-shadow: var(--box-shadow-lg);
  backdrop-filter: blur(15px);
  transition: var(--transition);
  
  @media screen and (max-width: 768px) {
    gap: 1px;
  }
`;

const WeekdayHeader = styled.div`
  background: rgba(255, 255, 255, 0.03);
  padding: 12px 8px;
  text-align: center;
  font-weight: 700;
  color: var(--text-primary);
  font-size: 0.85rem;
  letter-spacing: 0.5px;
  backdrop-filter: blur(10px);
  
  @media screen and (max-width: 768px) {
    padding: 10px 6px;
    font-size: 0.75rem;
  }
  
  @media screen and (max-width: 480px) {
    padding: 8px 4px;
    font-size: 0.7rem;
  }
`;

const DateNumber = styled.div`
  font-weight: 700;
  margin-bottom: 8px;
  background: var(--gradient-primary);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-size: 1.1rem;
  
  @media screen and (max-width: 768px) {
    font-size: 1rem;
    margin-bottom: 6px;
  }
  
  @media screen and (max-width: 480px) {
    font-size: 0.9rem;
    margin-bottom: 4px;
  }
`;

const DateCell = styled.div`
  background: rgba(255, 255, 255, 0.03);
  min-height: 90px;
  padding: 8px;
  position: relative;
  transition: var(--transition);
  backdrop-filter: blur(10px);
  
  &:hover {
    background: var(--gradient-primary);
    color: white;
    transform: scale(1.02);
    
    ${DateNumber} {
      color: white;
      background: none;
      -webkit-text-fill-color: white;
    }
  }
  
  &.other-month {
    background: rgba(155, 149, 255, 0.1);
    color: rgba(155, 149, 255, 0.6);
    opacity: 0.7;
    
    ${DateNumber} {
      color: rgba(155, 149, 255, 0.6);
      background: none;
      -webkit-text-fill-color: rgba(155, 149, 255, 0.6);
    }
  }
  
  @media screen and (max-width: 768px) {
    min-height: 70px;
    padding: 6px;
  }
  
  @media screen and (max-width: 480px) {
    min-height: 60px;
    padding: 4px;
  }
`;

const EventIndicator = styled.div`
  background: var(--gradient-primary);
  color: white;
  font-size: 0.7rem;
  font-weight: 600;
  padding: 2px 6px;
  border-radius: 10px;
  margin-bottom: 2px;
  cursor: pointer;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  transition: var(--transition);
  box-shadow: 0 1px 3px rgba(155, 149, 255, 0.3);
  
  &:hover {
    background: linear-gradient(135deg, #8B7FFF 0%, #B490FF 50%, #D8A7FF 100%);
    transform: translateY(-1px);
    box-shadow: 0 2px 6px rgba(155, 149, 255, 0.4);
  }
  
  @media screen and (max-width: 768px) {
    font-size: 0.65rem;
    padding: 2px 4px;
    margin-bottom: 2px;
  }
  
  @media screen and (max-width: 480px) {
    font-size: 0.6rem;
    padding: 1px 3px;
    margin-bottom: 1px;
  }
`;

const Calendar = () => {
  const navigate = useNavigate();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState([]);

  useEffect(() => {
    fetchEvents();
  }, [currentDate]);

  const fetchEvents = async () => {
    try {
      const response = await api.get('/events');
      setEvents(response.data.events || []);
    } catch (error) {
      console.error('Failed to fetch events:', error);
    }
  };

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    const days = [];
    const current = new Date(startDate);
    
    for (let i = 0; i < 42; i++) {
      days.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }
    
    return days;
  };

  const getEventsForDay = (date) => {
    return events.filter(event => {
      const eventDate = new Date(event.date);
      return eventDate.toDateString() === date.toDateString();
    });
  };

  const navigateMonth = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + direction);
    setCurrentDate(newDate);
  };

  const days = getDaysInMonth(currentDate);
  const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"];
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <>
      <ThemeBackground />
      <CalendarWrapper style={{ position: 'relative', zIndex: 1 }}>
      <HeaderSection>
        <MonthNavigator onClick={() => navigateMonth(-1)}>‹ Previous</MonthNavigator>
        
        <DateControls>
          <DateDropdown 
            value={currentDate.getMonth()}
            onChange={(e) => {
              const newDate = new Date(currentDate);
              newDate.setMonth(parseInt(e.target.value));
              setCurrentDate(newDate);
            }}
          >
            {monthNames.map((month, index) => (
              <option key={index} value={index}>{month}</option>
            ))}
          </DateDropdown>
          
          <DateDropdown 
            value={currentDate.getFullYear()}
            onChange={(e) => {
              const newDate = new Date(currentDate);
              newDate.setFullYear(parseInt(e.target.value));
              setCurrentDate(newDate);
            }}
          >
            {Array.from({length: 10}, (_, i) => {
              const year = new Date().getFullYear() - 5 + i;
              return <option key={year} value={year}>{year}</option>;
            })}
          </DateDropdown>
        </DateControls>
        
        <MonthNavigator onClick={() => navigateMonth(1)}>Next ›</MonthNavigator>
      </HeaderSection>

      <CalendarLayout>
        {dayNames.map(day => (
          <WeekdayHeader key={day}>{day}</WeekdayHeader>
        ))}
        
        {days.map((day, index) => {
          const dayEvents = getEventsForDay(day);
          const isCurrentMonth = day.getMonth() === currentDate.getMonth();
          
          return (
            <DateCell key={index} className={!isCurrentMonth ? 'other-month' : ''}>
              <DateNumber>{day.getDate()}</DateNumber>
              {dayEvents.map(event => (
                <EventIndicator 
                  key={event.id}
                  onClick={() => navigate(`/events/${event.id}`)}
                >
                  {event.title}
                </EventIndicator>
              ))}
            </DateCell>
          );
        })}
      </CalendarLayout>
    </CalendarWrapper>
    </>
  );
};

export default Calendar;