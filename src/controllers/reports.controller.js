const Reports = require('../models/reports.model');

exports.studentAttendance = async (req, res, next) => {
  try {
    res.json(await Reports.studentAttendance(req.query));
  } catch (err) {
    next(err);
  }
};

exports.classAttendance = async (req, res, next) => {
  try {
    res.json(await Reports.classAttendance(req.query));
  } catch (err) {
    next(err);
  }
};

exports.subjectAttendance = async (req, res, next) => {
  try {
    res.json(await Reports.subjectAttendance(req.query));
  } catch (err) {
    next(err);
  }
};

exports.teacherAttendance = async (req, res, next) => {
  try {
    res.json(await Reports.teacherAttendance(req.query));
  } catch (err) {
    next(err);
  }
};

exports.monthlySummary = async (req, res, next) => {
  try {
    res.json(await Reports.monthlySummary(req.query));
  } catch (err) {
    next(err);
  }
};
