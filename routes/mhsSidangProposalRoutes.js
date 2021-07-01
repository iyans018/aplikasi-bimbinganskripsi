const router = require('express').Router();
const mhsSidangProposalController = require('../controllers/mhsSidangProposalController');

router.get('/sidangproposal', mhsSidangProposalController.mhs_sidangproposal_get);

module.exports = router;