const router = require('express').Router();
const adminLaporanController = require('../controllers/adminLaporanController');

router.get('/proposal', adminLaporanController.admin_laporanproposal_get);
router.get('/proposal/csvdownload', adminLaporanController.admin_laporanproposal_download);
router.get('/proposal/exceldownload', adminLaporanController.admin_laporanproposal_exceldownload);
router.get('/proposal/:id', adminLaporanController.admin_laporanproposal_update_get);
router.put('/proposal/:id', adminLaporanController.admin_laporanproposal_update_put);
router.get('/skripsi', adminLaporanController.admin_laporanskripsi_get);
router.get('/skripsi/csvdownload', adminLaporanController.admin_laporanskripsi_download);
router.get('/skripsi/exceldownload', adminLaporanController.admin_laporanskripsi_exceldownload);
router.get('/skripsi/:id', adminLaporanController.admin_laporanskripsi_update_get);
router.put('/skripsi/:id', adminLaporanController.admin_laporanskripsi_update_put);

module.exports = router;