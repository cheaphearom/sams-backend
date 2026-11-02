// controllers/attendanceReport.controller.js
const AttendanceReport = require('../models/attendanceReport.model');

async function getSummaryBySchedule(req, res) {
  const { schedule_id } = req.params;

  if (!schedule_id) {
    return res.status(400).json({ message: 'schedule_id is required' });
  }

  try {
    const data = await AttendanceReport.getSummaryBySchedule(schedule_id);

    return res.json({
      schedule_id,
      count: data.length,
      students: data,
    });
  } catch (err) {
    console.error('Error in getSummaryBySchedule:', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

module.exports = {
  getSummaryBySchedule,
};
