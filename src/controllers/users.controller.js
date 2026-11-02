const bcrypt = require('bcryptjs');
const Users = require('../models/users.model');

exports.getAll = async (req, res, next) => {
  try {
    const users = await Users.getAll();
    res.json(users);
  } catch (err) {
    next(err);
  }
};

exports.create = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;
    const password_hash = await bcrypt.hash(password, 10);

    const image = req.file ? req.file.filename : null;

    const user = await Users.create({
      name,
      email,
      password_hash,
      role,
      image
    });

    res.status(201).json(user);
  } catch (err) {
    if (err.code === '23505') {
      err.status = 400;
      err.message = 'Email already in use';
    }
    next(err);
  }
};

exports.update = async (req, res, next) => {
  try {
    const image = req.file ? req.file.filename : req.body.image; // Keep old image

    const user = await Users.update(req.params.id, {
      ...req.body,
      image
    });

    res.json(user);
  } catch (err) {
    next(err);
  }
};

exports.remove = async (req, res, next) => {
  try {
    await Users.remove(req.params.id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};
