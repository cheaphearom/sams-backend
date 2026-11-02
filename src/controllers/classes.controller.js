const Classes = require('../models/classes.model');

exports.getAll = async (req, res, next) => {
  try {
    const data = await Classes.getAll();
    res.json(data);
  } catch (err) {
    next(err);
  }
};

exports.getOne = async (req, res, next) => {
  try {
    const item = await Classes.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Class not found' });
    res.json(item);
  } catch (err) {
    next(err);
  }
};

exports.create = async (req, res, next) => {
  try {
    const item = await Classes.create(req.body);
    res.status(201).json(item);
  } catch (err) {
    next(err);
  }
};

exports.update = async (req, res, next) => {
  try {
    const item = await Classes.update(req.params.id, req.body);
    res.json(item);
  } catch (err) {
    next(err);
  }
};

exports.remove = async (req, res, next) => {
  try {
    await Classes.remove(req.params.id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};
