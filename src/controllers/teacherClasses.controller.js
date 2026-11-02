const TeacherClasses = require('../models/teacherClasses.model');
const Teachers = require('../models/teachers.model');

exports.getAll = async (req, res, next) => {
  try {
    const data = await TeacherClasses.getAll();
    res.json(data);
  } catch (err) {
    next(err);
  }
};

// exports.getOne = async (req, res, next) => {
//   try {
//     const item = await TeacherClasses.findById(req.params.id);
//     if (!item) return res.status(404).json({ message: 'Teacher class not found' });
//     res.json(item);
//   } catch (err) {
//     next(err);
//   }
// };

exports.getByTeacher = async (req, res, next) => {
  try {
    const teacherId = await resolveTeacherId(req);
    const data = await TeacherClasses.findByTeacher(teacherId);
    res.json(data);
  } catch (err) {
    next(err);
  }
};

exports.getByClass = async (req, res, next) => {
  try {
    const data = await TeacherClasses.findByClass(req.params.class_id);
    res.json(data);
  } catch (err) {
    next(err);
  }
};

// teacher (by user_id)
exports.getByUser = async (req, res, next) => {
  try {
    const data = await TeacherClasses.findByUser(req.params.user_id);
    res.json(data);
  } catch (err) {
    next(err);
  }
};

exports.create = async (req, res, next) => {
  try {
    const item = await TeacherClasses.create(req.body);
    res.status(201).json(item);
  } catch (err) {
    next(err);
  }
};

exports.update = async (req, res, next) => {
  try {
    const item = await TeacherClasses.update(req.params.id, req.body);
    res.json(item);
  } catch (err) {
    next(err);
  }
};

exports.remove = async (req, res, next) => {
  try {
    await TeacherClasses.remove(req.params.id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};

// teacher 
async function resolveTeacherId(req) {
  if (req.user?.role === 'teacher') {
    const teacherId = await Teachers.getTeacherIdByUserId(req.user.id);
    return teacherId;
  }
  // admin can pass ?teacher_id=
  if (req.user?.role === 'admin') return Number(req.query.teacher_id) || null;
  return null;
}
exports.getMine = async (req, res, next) => {
  try {
    const teacherId = await resolveTeacherId(req);
    if (!teacherId) return res.status(400).json({ message: 'Teacher not found' });

    const data = await TeacherClasses.getMyClasses(teacherId);
    res.json(data);
  } catch (err) {
    next(err);
  }
};
exports.getOne = async (req, res, next) => {
  try {
    const teacherId = await resolveTeacherId(req);
    if (!teacherId) return res.status(400).json({ message: 'Teacher not found' });

    const item = await TeacherClasses.getMyClassById(teacherId, req.params.classId);
    if (!item) return res.status(404).json({ message: 'Class not found' });

    res.json(item);
  } catch (err) {
    next(err);
  }
};

exports.getStudents = async (req, res, next) => {
  try {
    console.log(req);
    
    const teacherId = await resolveTeacherId(req);
    if (!teacherId) return res.status(400).json({ message: 'Teacher not found' });

    const students = await TeacherClasses.getStudentsInClass(teacherId, req.params.classId);
    if (!students) return res.status(404).json({ message: 'Class not found' });

    res.json(students);
  } catch (err) {
    next(err);
  }
};