const Students = require('../models/students.model');
const Users = require('../models/users.model');
const bcrypt = require('bcryptjs');

exports.getAll = async (req, res, next) => {
  try {
    const data = await Students.getAll();
    res.json(data);
  } catch (err) {
    next(err);
  }
};

exports.getOne = async (req, res, next) => {
  try {
    const item = await Students.findById(req.params.id);
    console.log(item);
    
    if (!item) return res.status(404).json({ message: 'Student not found' });
    res.json(item);
  } catch (err) {
    next(err);
  }
};

exports.getByClass = async (req, res, next) => {
  try {
    const data = await Students.findByClass(req.params.class_id);
    res.json(data);
  } catch (err) {
    next(err);
  }
};

exports.create = async (req, res, next) => {
  try {
    const {
      name,
      first_name,
      last_name,
      email,
      student_code,
      class_id,
      password,
      role,
    } = req.body;

    const displayName =
      name ||
      `${first_name || ''} ${last_name || ''}`.trim() ||
      'Unknown';

    const plainPassword = password || student_code || 'password123';
    const password_hash = await bcrypt.hash(plainPassword, 10);

    const image = req.file ? req.file.filename : null;

    const user = await Users.create({
      name: displayName,
      email,
      password_hash,
      role: role || 'student',
    });
    
    const student = await Students.create({
      user_id: user.id,
      first_name: first_name || name || '',
      last_name: last_name || '',
      image,
      student_code,
      class_id,
    });

    res.status(201).json({
      ...student,
      user,
    });
  } catch (err) {
    if (err.code === '23505') {
      err.status = 400;
      err.message = 'Email or student code already used';
    }
    next(err);
  }
};

exports.update = async (req, res, next) => {
  try {
    const item = await Students.update(req.params.id, req.body);
    res.json(item);
  } catch (err) {
    next(err);
  }
};

exports.remove = async (req, res, next) => {
  try {
    await Students.remove(req.params.id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};
