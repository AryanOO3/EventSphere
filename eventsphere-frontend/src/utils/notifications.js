// Notification utility functions
export const addNotification = (notification) => {
  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
  const userId = currentUser.id;
  
  console.log('addNotification called with:', notification);
  console.log('Current user from localStorage:', currentUser);
  console.log('User ID:', userId);
  
  if (!userId) {
    console.log('No user ID found, not adding notification');
    return;
  }
  
  const stored = localStorage.getItem(`notifications_${userId}`);
  const notifications = stored ? JSON.parse(stored) : [];
  
  const newNotification = {
    id: Date.now(),
    read: false,
    created_at: new Date().toISOString(),
    ...notification
  };
  
  notifications.unshift(newNotification);
  localStorage.setItem(`notifications_${userId}`, JSON.stringify(notifications));
  
  console.log('Notification stored:', newNotification);
  console.log('All notifications for user:', notifications);
  
  // Trigger update event for components
  window.dispatchEvent(new CustomEvent('notificationAdded'));
};

export const NOTIFICATION_TYPES = {
  WELCOME: 'welcome',
  RSVP_SUCCESS: 'rsvp_success',
  CHECK_IN: 'check_in',
  EVENT_REMINDER: 'event_reminder',
  EVENT_CREATED: 'event_created',
  ADMIN_TASK: 'admin_task',
  LOGIN_EVENTS: 'login_events'
};

export const createWelcomeNotification = (userName) => ({
  title: `Welcome back, ${userName}!`,
  message: 'Ready to explore amazing events? Check out what\'s happening around you.',
  type: NOTIFICATION_TYPES.WELCOME
});

export const createRsvpNotification = (eventTitle, status) => ({
  title: status === 'yes' ? 'RSVP Confirmed!' : 'RSVP Updated',
  message: status === 'yes' 
    ? `You're registered for "${eventTitle}". Don't forget to check in!`
    : `You've updated your RSVP for "${eventTitle}".`,
  type: NOTIFICATION_TYPES.RSVP_SUCCESS
});

export const createCheckInNotification = (eventTitle) => ({
  title: 'Check-in Successful!',
  message: `Welcome to "${eventTitle}". Enjoy the event!`,
  type: NOTIFICATION_TYPES.CHECK_IN
});

export const createEventReminderNotification = (eventTitle, timeUntil) => ({
  title: 'Event Reminder',
  message: `"${eventTitle}" starts ${timeUntil}!`,
  type: NOTIFICATION_TYPES.EVENT_REMINDER
});

export const createEventCreatedNotification = (eventTitle, creatorName) => ({
  title: 'New Event Created',
  message: `"${eventTitle}" has been created by ${creatorName}`,
  type: NOTIFICATION_TYPES.EVENT_CREATED
});

export const createAdminTaskNotification = (task, details) => ({
  title: `Admin Task: ${task}`,
  message: details,
  type: NOTIFICATION_TYPES.ADMIN_TASK
});

export const createLoginEventsNotification = (eventCount) => ({
  title: 'Upcoming Events!',
  message: eventCount === 1 
    ? 'There is 1 upcoming event happening soon. Check it out!' 
    : `There are ${eventCount} upcoming events happening soon. Don't miss out!`,
  type: NOTIFICATION_TYPES.LOGIN_EVENTS
});

// Event reminder scheduler
export const scheduleEventReminders = () => {
  const stored = localStorage.getItem('notifications');
  const notifications = stored ? JSON.parse(stored) : [];
  
  // Check for events happening today
  const today = new Date().toDateString();
  const events = JSON.parse(localStorage.getItem('userEvents') || '[]');
  
  events.forEach(event => {
    const eventDate = new Date(event.date);
    if (eventDate.toDateString() === today) {
      const timeUntil = eventDate.getTime() - Date.now();
      if (timeUntil > 0 && timeUntil <= 3600000) { // 1 hour before
        const existing = notifications.find(n => 
          n.type === NOTIFICATION_TYPES.EVENT_REMINDER && 
          n.message.includes(event.title)
        );
        if (!existing) {
          addNotification(createEventReminderNotification(event.title, 'in 1 hour'));
        }
      }
    }
  });
};

// Call this periodically
setInterval(scheduleEventReminders, 300000); // Check every 5 minutes