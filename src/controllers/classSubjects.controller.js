const ClassSubjects = require('../models/classSubjects.model');

exports.getAll = async (req, res, next) => {
  try {
    const data = await ClassSubjects.getAll();
    res.json(data);
  } catch (err) {
    next(err);
  }
};

exports.getOne = async (req, res, next) => {
  try {
    const item = await ClassSubjects.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Class-subject not found' });
    res.json(item);
  } catch (err) {
    next(err);
  }
};

exports.getByClass = async (req, res, next) => {
  try {
    const data = await ClassSubjects.findByClass(req.params.class_id);
    res.json(data);
  } catch (err) {
    next(err);
  }
};

exports.create = async (req, res, next) => {
  try {
    const item = await ClassSubjects.create(req.body);
    res.status(201).json(item);
  } catch (err) {
    if (err.code === '23505') {
      err.status = 400;
      err.message = 'This subject is already assigned to the class';
    }
    next(err);
  }
};

exports.update = async (req, res, next) => {
  try {
    const item = await ClassSubjects.update(req.params.id, req.body);
    res.json(item);
  } catch (err) {
    next(err);
  }
};

exports.remove = async (req, res, next) => {
  try {
    await ClassSubjects.remove(req.params.id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};
