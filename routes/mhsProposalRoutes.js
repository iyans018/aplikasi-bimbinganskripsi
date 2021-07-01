const router = require('express').Router();
const multer = require('multer');
const mhsProposalController = require('../controllers/mhsProposalController');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
      cb(null, './uploads/file proposal');
  },
  filename: (req, file, cb) => {
      const filePath = file.originalname;
      cb(null, filePath);
  }
});
const upload = multer({ storage });

router.get('/proposalskripsi', mhsProposalController.mhs_proposal_get);
router.post('/proposalskripsi', upload.single('fileProposal'), mhsProposalController.mhs_proposal_post);
router.delete('/proposalskripsi', mhsProposalController.mhs_proposal_delete);
router.get('/proposalskripsi/download/:id', mhsProposalController.mhs_proposal_download);

module.exports = router;