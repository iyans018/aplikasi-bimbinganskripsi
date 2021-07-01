const router = require('express').Router();
const multer = require('multer');
const mhsDaftarPengujianController = require('../controllers/mhsDaftarPengujianController');

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

router.get('/daftarpengujian', mhsDaftarPengujianController.mhs_pengujian_get);
router.post('/daftarpengujian', upload.single('fileSkripsi'), mhsDaftarPengujianController.mhs_pengujian_post);
router.get('/daftarpengujian/download/:id', mhsDaftarPengujianController.mhs_download_get)

module.exports = router