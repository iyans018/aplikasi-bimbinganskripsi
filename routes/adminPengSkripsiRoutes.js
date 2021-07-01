const router = require('express').Router();
const adminPengSkripsiController = require('../controllers/adminPengSkripsiController');

router.get('/pengajuanskripsi', adminPengSkripsiController.admin_pengajuan_get);
router.get('/pengajuanskripsi/download/:id', adminPengSkripsiController.admin_pengajuan_download);
router.get('/pengajuanskripsi/proses/:id', adminPengSkripsiController.admin_pengajuanproses_get);
router.put('/pengajuanskripsi/proses/:id', adminPengSkripsiController.admin_pengajuanproses_put);

module.exports = router;