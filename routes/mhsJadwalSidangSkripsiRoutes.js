const router = require('express').Router();
const mhsJadwalSidangSkripsiController = require('../controllers/mhsJadwalSidangSkripsiController');

router.get('/jadwalsidangskripsi', mhsJadwalSidangSkripsiController.mhs_sidang_get);

module.exports = router;