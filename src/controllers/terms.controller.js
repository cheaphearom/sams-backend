const Terms = require('../models/terms.model');

exports.getAll = async (req, res, next) => {
  try {
    const data = await Terms.getAll();
    res.json(data);
  } catch (err) {
    next(err);
  }
};

exports.getOne = async (req, res, next) => {
  try {
    const term = await Terms.findById(req.params.id);
    if (!term) return res.status(404).json({ message: 'Term not found' });
    res.json(term);
  } catch (err) {
    next(err);
  }
};

exports.create = async (req, res, next) => {
  try {
    const term = await Terms.create(req.body);
    res.status(201).json(term);
  } catch (err) {
    next(err);
  }
};

exports.update = async (req, res, next) => {
  try {
    const term = await Terms.update(req.params.id, req.body);
    res.json(term);
  } catch (err) {
    next(err);
  }
};

exports.remove = async (req, res, next) => {
  try {
    await Terms.remove(req.params.id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};
