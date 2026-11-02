const Schedules = require('../models/schedules.model');

exports.getAll = async (req, res, next) => {
  try {
    const data = await Schedules.getAll();
    res.json(data);
  } catch (err) {
    next(err);
  }
};

exports.getOne = async (req, res, next) => {
  try {
    const item = await Schedules.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Schedule not found' });
    res.json(item);
  } catch (err) {
    next(err);
  }  
};

exports.getByClass = async (req, res, next) => {
  try {
    const data = await Schedules.findByClass(req.params.class_id);
    res.json(data);
  } catch (err) {
    next(err);
  }
};

exports.create = async (req, res, next) => {
  try {
    const item = await Schedules.create(req.body);
    res.status(201).json(item);
  } catch (err) {
    next(err);
  }
};

exports.update = async (req, res, next) => {
  try {
    const item = await Schedules.update(req.params.id, req.body);
    res.json(item);
  } catch (err) {
    next(err);
  }
};

exports.remove = async (req, res, next) => {
  try {
    await Schedules.remove(req.params.id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};

// studnets
exports.getByUser = async (req, res, next) => {
  try {
    const data = await Schedules.findByUser(req.params.user_id);    
    res.json(data);
  } catch (err) {
    next(err);
  }
};
