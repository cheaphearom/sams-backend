// controllers/face.controller.js
const Face = require('../services/face.service');
const Students = require('../models/students.model');

exports.enroll = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const { imageBase64 } = req.body;
    if (!imageBase64) return res.status(400).json({ message: 'imageBase64 required' });

    const descriptor = await Face.getDescriptorFromBase64(imageBase64); // [128 floats]
    await Students.saveFaceDescriptorByUserId(userId, descriptor);

    res.json({ message: 'Face enrolled' });
  } catch (e) { next(e); }
};
