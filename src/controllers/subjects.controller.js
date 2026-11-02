const Subjects = require('../models/subjects.model');

exports.getAll = async (req, res, next) => {
  try {
    const data = await Subjects.getAll();
    res.json(data);
  } catch (err) {
    next(err);
  }
};

exports.getOne = async (req, res, next) => {
  try {
    const item = await Subjects.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Subject not found' });
    res.json(item);
  } catch (err) {
    next(err);
  }
};

exports.create = async (req, res, next) => {
  try {
    const item = await Subjects.create(req.body);
    res.status(201).json(item);
  } catch (err) {
    if (err.code === '23505') {
      err.status = 400;
      err.message = 'Subject code already used';
    }
    next(err);
  }
};

exports.update = async (req, res, next) => {
  try {
    const item = await Subjects.update(req.params.id, req.body);
    res.json(item);
  } catch (err) {
    next(err);
  }
};

exports.remove = async (req, res, next) => {
  try {
    await Subjects.remove(req.params.id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};
