const checkRole = (allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: "Authentication required" });
    }

    // Superadmin has access to everything
    if (req.user.role === 'superadmin') {
      return next();
    }

    // Superadmin has access to everything
    if (req.user.role === 'superadmin') {
      return next();
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ error: "Access denied" });
    }

    next();
  };
};

const checkPermission = (permission) => {
  const permissions = {
    user: ['view_events', 'rsvp', 'edit_profile'],
    admin: ['view_events', 'rsvp', 'edit_profile', 'create_events', 'edit_events', 'delete_events', 'view_rsvps', 'upload_files'],
    superadmin: ['*']
  };

  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: "Authentication required" });
    }

    const userPermissions = permissions[req.user.role] || [];
    
    if (userPermissions.includes('*') || userPermissions.includes(permission)) {
      return next();
    }

    return res.status(403).json({ error: "Insufficient permissions" });
  };
};

module.exports = { checkRole, checkPermission };