const Departments = require('../models/departments.model');

exports.getAll = async (req, res, next) => {
  try {
    const data = await Departments.getAll();
    res.json(data);
  } catch (err) {
    next(err);
  }
};

exports.getOne = async (req, res, next) => {
  try {
    const item = await Departments.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Department not found' });
    res.json(item);
  } catch (err) {
    next(err);
  }
};

exports.getByFaculty = async (req, res, next) => {
  try {
    const data = await Departments.findByFaculty(req.params.faculty_id);
    res.json(data);
  } catch (err) {
    next(err);
  }
};

exports.create = async (req, res, next) => {
  try {
    const item = await Departments.create(req.body);
    res.status(201).json(item);
  } catch (err) {
    next(err);
  }
};

exports.update = async (req, res, next) => {
  try {
    const item = await Departments.update(req.params.id, req.body);
    res.json(item);
  } catch (err) {
    next(err);
  }
};

exports.remove = async (req, res, next) => {
  try {
    await Departments.remove(req.params.id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};
