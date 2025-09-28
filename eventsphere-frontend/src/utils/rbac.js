export const ROLES = {
  USER: 'user',
  ADMIN: 'admin',
  SUPERADMIN: 'superadmin'
};

export const PERMISSIONS = {
  VIEW_EVENTS: 'view_events',
  RSVP: 'rsvp',
  EDIT_PROFILE: 'edit_profile',
  CREATE_EVENTS: 'create_events',
  EDIT_EVENTS: 'edit_events',
  DELETE_EVENTS: 'delete_events',
  VIEW_RSVPS: 'view_rsvps',
  UPLOAD_FILES: 'upload_files',
  MANAGE_USERS: 'manage_users',
  MANAGE_ADMINS: 'manage_admins'
};

const rolePermissions = {
  [ROLES.USER]: [
    PERMISSIONS.VIEW_EVENTS,
    PERMISSIONS.RSVP,
    PERMISSIONS.EDIT_PROFILE
  ],
  [ROLES.ADMIN]: [
    PERMISSIONS.VIEW_EVENTS,
    PERMISSIONS.RSVP,
    PERMISSIONS.EDIT_PROFILE,
    PERMISSIONS.CREATE_EVENTS,
    PERMISSIONS.EDIT_EVENTS,
    PERMISSIONS.DELETE_EVENTS,
    PERMISSIONS.VIEW_RSVPS,
    PERMISSIONS.UPLOAD_FILES
  ],
  [ROLES.SUPERADMIN]: Object.values(PERMISSIONS)
};

export const hasPermission = (userRole, permission) => {
  if (!userRole) return false;
  const permissions = rolePermissions[userRole] || [];
  return permissions.includes(permission);
};

export const hasRole = (userRole, allowedRoles) => {
  if (!userRole) return false;
  return allowedRoles.includes(userRole);
};

export const canAccessRoute = (userRole, requiredRole) => {
  const roleHierarchy = {
    [ROLES.USER]: 1,
    [ROLES.ADMIN]: 2,
    [ROLES.SUPERADMIN]: 3
  };
  
  return roleHierarchy[userRole] >= roleHierarchy[requiredRole];
};