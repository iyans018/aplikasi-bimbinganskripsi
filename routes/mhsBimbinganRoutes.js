const router = require('express').Router();
const multer = require('multer');
const mhsBimbinganController = require('../controllers/mhsBimbinganController');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
      cb(null, './uploads/file skripsi');
  },
  filename: (req, file, cb) => {
      const filePath = file.originalname;
      cb(null, filePath);
  }
});
const upload = multer({ storage });

router.get('/bimbinganskripsi', mhsBimbinganController.mhs_bimbingan_get);
router.post('/bimbinganskripsi', upload.single('fileSkripsi'), mhsBimbinganController.mhs_bimbingan_post);
router.delete('/bimbinganskripsi', mhsBimbinganController.mhs_bimbingan_delete);
router.get('/bimbinganskripsi/download/:id', mhsBimbinganController.mhs_bimbingan_download);

module.exports = router;