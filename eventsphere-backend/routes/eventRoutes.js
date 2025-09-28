const express = require("express");
const router = express.Router();
const { 
  getAllEvents, 
  getEventById, 
  createEvent, 
  updateEvent, 
  deleteEvent,
  rsvpEvent,
  getUserRsvp,
  getEventRsvps,
  checkInUser,
  uploadEventFiles,
  getEventAttendance,
  deleteEventFile,
  getUserDashboardStats
} = require("../controllers/eventController");
const { verifyToken } = require("../middleware/authMiddleware");
const { checkPermission } = require("../middleware/rbacMiddleware");
const upload = require("../middleware/uploadMiddleware");

router.get("/", getAllEvents);
router.get("/:id", getEventById);

router.post("/", verifyToken, checkPermission('create_events'), upload.fields([{ name: 'cover_image', maxCount: 1 }, { name: 'event_files', maxCount: 5 }]), createEvent);
router.put("/:id", verifyToken, checkPermission('edit_events'), upload.fields([{ name: 'cover_image', maxCount: 1 }, { name: 'event_files', maxCount: 5 }]), updateEvent);
router.delete("/:id", verifyToken, checkPermission('delete_events'), deleteEvent);

router.post("/:id/rsvp", verifyToken, rsvpEvent);
router.get("/:id/rsvp", verifyToken, getUserRsvp);
router.get("/:id/rsvps", verifyToken, getEventRsvps);
router.post("/:eventId/checkin/:userId", verifyToken, checkInUser);
router.post("/:id/files", upload.array('files', 10), uploadEventFiles);
router.get("/:id/attendance", verifyToken, getEventAttendance);
router.delete("/:eventId/files/:filename", verifyToken, deleteEventFile);
router.get("/user/dashboard-stats", verifyToken, getUserDashboardStats);

module.exports = router;