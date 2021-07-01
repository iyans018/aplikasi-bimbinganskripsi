const router = require('express').Router();
const masterDataController = require('../controllers/masterDataController');

router.get('/user', masterDataController.user_get);
router.delete('/user', masterDataController.user_delete);
router.get('/user/tambah', masterDataController.user_tambah_get);
router.post('/user/tambah', masterDataController.user_tambah_post);
router.put('/user', masterDataController.user_update);
router.get('/dosen', masterDataController.dosen_get);
router.get('/dosen/tambah', masterDataController.dosen_tambah_get);
router.post('/dosen/tambah', masterDataController.dosen_tambah_post);
router.get('/dosen/:id', masterDataController.dosen_update_get);
router.put('/dosen/:id', masterDataController.dosen_update_put);
router.delete('/dosen', masterDataController.dosen_delete);
router.get('/mahasiswa', masterDataController.mahasiswa_get);
router.get('/mahasiswa/tambah', masterDataController.mahasiswa_tambah_get);
router.post('/mahasiswa/tambah', masterDataController.mahasiswa_tambah_post);
router.put('/mahasiswa/tambah', masterDataController.mahasiswa_tambah_change);
router.get('/mahasiswa/:id', masterDataController.mahasiswa_update_get);
router.put('/mahasiswa/:id', masterDataController.mahasiswa_update_put);
router.delete('/mahasiswa', masterDataController.mahasiswa_delete);
router.get('/bimbingan/:page', masterDataController.bimbingan_get);
router.delete('/bimbingan/:page', masterDataController.bimbingan_delete);
router.get('/bimbingan/update/:id', masterDataController.bimbingan_update_get);
router.put('/bimbingan/update/:id', masterDataController.bimbingan_update_put);

module.exports = router;