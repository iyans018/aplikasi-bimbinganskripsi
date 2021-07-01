const router = require('express').Router();
const dosenBimbinganController = require('../controllers/dosenBimbinganController');

router.get('/bimbinganskripsi', dosenBimbinganController.dosen_bimbingan_get);
router.get('/bimbinganskripsi/:id', dosenBimbinganController.dosen_bimbingan_proses_get);
router.put('/bimbinganskripsi/:id', dosenBimbinganController.dosen_bimbingan_proses_put);
router.get('/bimbinganskripsi/download/:id', dosenBimbinganController.dosen_bimbingan_download);

module.exports = router;