const router = require('express').Router();
const dosenDaftarBimbinganController = require('../controllers/dosenDaftarBimbinganController');

router.get('/daftarbimbingan', dosenDaftarBimbinganController.dosen_dafbim_get);

module.exports = router;