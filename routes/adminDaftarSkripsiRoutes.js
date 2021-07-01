const router = require('express').Router();
const adminPengSkripsiController = require('../controllers/adminDaftarSkripsiController');

router.get('/daftarskripsi', adminPengSkripsiController.admin_daftar_get);
router.put('/daftarskripsi', adminPengSkripsiController.admin_daftar_terima);

module.exports = router;