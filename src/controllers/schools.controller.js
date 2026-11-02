const Schools = require('../models/schools.model');

exports.getAll = async (req, res, next) => {
  try {
    res.json(await Schools.getAll());
  } catch (err) {
    next(err);
  }
};

exports.getOne = async (req, res, next) => {
  try {
    const item = await Schools.findById(req.params.id);
    console.log(req.params.id);
    
    if (!item) return res.status(404).json({ message: 'School not found' });
    res.json(item);
  } catch (err) {
    next(err);
  }
};

exports.create = async (req, res, next) => {
  try {
    const { name } = req.body;
    const image = req.file ? req.file.filename : null;

    if (!name) {
      return res.status(400).json({ message: 'Name is required' });
    }

    const school = await Schools.create({ name, image });
    res.status(201).json(school);
  } catch (err) {
    next(err);
  }
};

exports.update = async (req, res, next) => {
  try {
    const image = req.file ? req.file.filename : req.body.image; // keep old image

    const school = await Schools.update(req.params.id, {
      ...req.body,
      image
    });

    res.json(school);
  } catch (err) {
    next(err);
  }
};

exports.remove = async (req, res, next) => {
  try {
    await Schools.remove(req.params.id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};
