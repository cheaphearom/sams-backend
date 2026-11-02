const Faculties = require('../models/faculties.model');

exports.getAll = async (req, res, next) => {
  try {
    res.json(await Faculties.getAll());
  } catch (err) {
    next(err);
  }
};

exports.getOne = async (req, res, next) => {
  try {
    const item = await Faculties.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Faculty not found' });
    res.json(item);
  } catch (err) {
    next(err);
  }
};

exports.create = async (req, res, next) => {
  try {
    const { name, code } = req.body;
    const image = req.file ? req.file.filename : null;

    if (!name || !code) {
      return res.status(400).json({ message: 'Name and code are required' });
    }

    const faculty = await Faculties.create({
      name,
      code,
      image
    });

    res.status(201).json(faculty);

  } catch (err) {
    if (err.code === '23505') {
      err.status = 400;
      err.message = 'Faculty code already used';
    }
    next(err);
  }
};

exports.update = async (req, res, next) => {
  try {
    const image = req.file ? req.file.filename : req.body.image; // keep old image

    const faculty = await Faculties.update(req.params.id, {
      ...req.body,
      image
    });

    res.json(faculty);
  } catch (err) {
    next(err);
  }
};

exports.remove = async (req, res, next) => {
  try {
    await Faculties.remove(req.params.id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};
