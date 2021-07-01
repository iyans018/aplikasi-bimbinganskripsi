const router = require('express').Router();
const adminDaftarPengujianController = require('../controllers/adminDaftarPengujianController');

router.get('/daftarpengujian', adminDaftarPengujianController.admin_pengujian_get);
router.get('/daftarpengujian/:id', adminDaftarPengujianController.admin_proses_get);
router.put('/daftarpengujian/:id', adminDaftarPengujianController.admin_proses_put);
router.get('/daftarpengujian/download/:id', adminDaftarPengujianController.admin_download_get);

module.exports = router;