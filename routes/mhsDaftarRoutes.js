const router = require('express').Router();
const mhsDaftarController = require('../controllers/mhsDaftarController');

router.get('/daftarskripsi', mhsDaftarController.mhs_daftar_get);
router.post('/daftarskripsi', mhsDaftarController.mhs_daftar_post);

module.exports = router;