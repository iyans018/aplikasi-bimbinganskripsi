const router = require('express').Router();
const mhsProfileController = require('../controllers/mhsProfileController');

router.get('/profile', mhsProfileController.mhs_profile_get);
router.post('/profile', mhsProfileController.mhs_profile_post);
router.put('/profile', mhsProfileController.mhs_profile_put);

module.exports = router;