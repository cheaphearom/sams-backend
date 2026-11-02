const AttendanceSessions = require('../models/attendanceSessions.model');

exports.getAll = async (req, res, next) => {
  try {
    const data = await AttendanceSessions.getAll();
    res.json(data);
  } catch (err) {
    next(err);
  }
};

exports.getOne = async (req, res, next) => {
  try {
    const item = await AttendanceSessions.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Attendance session not found' });
    res.json(item);
  } catch (err) {
    next(err);
  }
};

exports.getBySchedule = async (req, res, next) => {
  try {
    const data = await AttendanceSessions.findBySchedule(req.params.schedule_id);
    res.json(data);
  } catch (err) {
    next(err);
  }
};

exports.getByClass = async (req, res, next) => {
  try {
    const data = await AttendanceSessions.findByClass(req.params.class_id);
    res.json(data);
  } catch (err) {
    next(err);
  }
};

exports.create = async (req, res, next) => {
  try {
    const item = await AttendanceSessions.create(req.body);
    res.status(201).json(item);
  } catch (err) {
    next(err);
  }
};

exports.update = async (req, res, next) => {
  try {
    const item = await AttendanceSessions.update(req.params.id, req.body);
    res.json(item);
  } catch (err) {
    next(err);
  }
};

exports.remove = async (req, res, next) => {
  try {
    await AttendanceSessions.remove(req.params.id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};
