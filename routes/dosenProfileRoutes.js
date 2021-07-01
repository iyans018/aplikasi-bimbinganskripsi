const router = require('express').Router();
const dosenProfileController = require('../controllers/dosenProfileController');

router.get('/profile', dosenProfileController.dosen_profile_get);
router.put('/profile', dosenProfileController.dosen_profile_put);

module.exports = router;