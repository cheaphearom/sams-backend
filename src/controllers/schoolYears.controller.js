const SchoolYears = require('../models/schoolYears.model');

exports.getAll = async (req, res, next) => {
  try {
    const data = await SchoolYears.getAll();
    res.json(data);
  } catch (err) {
    next(err);
  }
};

exports.getOne = async (req, res, next) => {
  try {
    const year = await SchoolYears.findById(req.params.id);
    if (!year) return res.status(404).json({ message: 'School year not found' });
    res.json(year);
  } catch (err) {
    next(err);
  }
};

exports.create = async (req, res, next) => {
  try {
    const year = await SchoolYears.create(req.body);
    res.status(201).json(year);
  } catch (err) {
    next(err);
  }
};

exports.update = async (req, res, next) => {
  try {
    const year = await SchoolYears.update(req.params.id, req.body);
    res.json(year);
  } catch (err) {
    next(err);
  }
};

exports.remove = async (req, res, next) => {
  try {
    await SchoolYears.remove(req.params.id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};
