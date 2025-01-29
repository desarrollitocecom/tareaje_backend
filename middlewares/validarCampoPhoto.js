const validatePhotoField = (req, res, next) => {
  if (!req.files) {
    return res.status(400).json({
      errors: [{ msg: "El campo photos es obligatorio." }],
    });
  }
  next();
};

module.exports = validatePhotoField;
