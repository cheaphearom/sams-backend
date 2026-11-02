const Teachers = require('../models/teachers.model');

exports.getAll = async (req, res, next) => {
  try {
    const data = await Teachers.getAll();
    res.json(data);
  } catch (err) {
    next(err);
  }
};

exports.getOne = async (req, res, next) => {
  try {
    const item = await Teachers.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Teacher not found' });
    res.json(item);
  } catch (err) {
    next(err);
  }
};

exports.create = async (req, res, next) => {
  try {
    const item = await Teachers.create(req.body);
    res.status(201).json(item);
  } catch (err) {
    if (err.code === '23505') {
      err.status = 400;
      err.message = 'Employee code already used';
    }
    next(err);
  }
};

exports.update = async (req, res, next) => {
  try {
    const item = await Teachers.update(req.params.id, req.body);
    res.json(item);
  } catch (err) {
    next(err);
  }
};

exports.remove = async (req, res, next) => {
  try {
    await Teachers.remove(req.params.id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};
