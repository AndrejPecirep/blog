const fs = require('fs');
const path = require('path');

// Spremanje slike na lokalni disk
exports.saveImage = (file) => {
  if (!file) return null;

  const uploadPath = path.join(__dirname, '..', 'uploads', file.originalname);
  fs.writeFileSync(uploadPath, file.buffer);
  return `/uploads/${file.originalname}`;
};

// Brisanje slike
exports.deleteImage = (filePath) => {
  if (!filePath) return;
  const fullPath = path.join(__dirname, '..', filePath);
  if (fs.existsSync(fullPath)) fs.unlinkSync(fullPath);
};
