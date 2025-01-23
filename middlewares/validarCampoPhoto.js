const validatePhotoField = (req, res, next) => {
  if (!req.file) {
    return res.status(400).json({
      errors: [{ msg: "El campo photo es obligatorio." }],
    });
  }
  next();
};

module.exports = validatePhotoField;
