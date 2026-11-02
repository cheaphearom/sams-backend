const Dashboard = require('../models/dashboard.model');

async function getDashboardData(req, res) {
  try {
    const data = await Dashboard.getDashboardData();
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Dashboard error' });
  }
}
async function getDashboardDataStudent(req, res) {
  try {
    const userId = req.params.user_id;
    
    const data = await Dashboard.getDashboardDataStudent(userId);
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Dashboard error' });
  }
}

module.exports = { getDashboardData, getDashboardDataStudent };
